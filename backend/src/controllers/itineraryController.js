const { GoogleGenAI } = require('@google/genai');
const Trip = require('../models/Trip');
const Itinerary = require('../models/Itinerary');
const LocationCache = require('../models/LocationCache');

// Initialize Gemini client (key lives only in backend/.env — never sent to React)
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY
});

// Helper: build a structured prompt from trip data
const buildPrompt = (trip) => {
  const startDate = new Date(trip.startDate);
  const endDate = new Date(trip.endDate);
  const numDays = Math.max(
    1,
    Math.round((endDate - startDate) / (1000 * 60 * 60 * 24)) + 1
  );

  const formatDate = (d) =>
    d.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' });

  const interests = trip.interests?.length > 0 ? trip.interests.join(', ') : 'General sightseeing';

  return `You are an expert travel planner. Generate a detailed, day-by-day travel itinerary as structured JSON.

Trip details:
- Destination: ${trip.destination}
- Start Date: ${formatDate(startDate)}
- End Date: ${formatDate(endDate)}
- Duration: ${numDays} day(s)
- Total Budget: $${trip.budget} USD for ${trip.travelers} traveler(s)
- Traveler Interests: ${interests}

Return a JSON object with exactly this structure (no extra keys, no markdown):
{
  "days": [
    {
      "day": 1,
      "date": "Monday, October 1, 2026",
      "title": "Arrival & First Impressions",
      "activities": [
        {
          "time": "09:00 AM",
          "activity": "Activity name",
          "description": "Brief description of what to do and see",
          "estimatedCost": 25
        }
      ],
      "meals": {
        "breakfast": "Name of place or meal suggestion",
        "lunch": "Name of place or meal suggestion",
        "dinner": "Name of place or meal suggestion"
      },
      "accommodation": "Hotel or lodging recommendation",
      "estimatedDayBudget": 200
    }
  ]
}

Rules:
- Generate exactly ${numDays} day object(s), one per day of the trip.
- Each day should have 3–5 activities with realistic times and costs.
- estimatedCost values are in USD per person.
- estimatedDayBudget should be the sum of activity costs plus meals/accommodation per person.
- Keep total costs roughly within the $${trip.budget} total budget across all days.
- Tailor activities to the stated interests: ${interests}.
- Return only valid JSON — no markdown, no code blocks, no explanations.`;
};

// @desc    Generate an AI itinerary for a trip
// @route   POST /api/itinerary/generate
// @access  Private
const generateItinerary = async (req, res) => {
  try {
    const { tripId } = req.body;

    if (!tripId) {
      return res.status(400).json({
        success: false,
        message: 'tripId is required'
      });
    }

    // Fetch and verify trip ownership
    const trip = await Trip.findById(tripId);
    if (!trip) {
      return res.status(404).json({
        success: false,
        message: 'Trip not found'
      });
    }
    if (trip.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized to generate itinerary for this trip'
      });
    }

    // Verify API key is configured
    if (!process.env.GEMINI_API_KEY || process.env.GEMINI_API_KEY === 'your_gemini_api_key_here') {
      return res.status(503).json({
        success: false,
        message: 'Gemini API key is not configured. Please add GEMINI_API_KEY to backend/.env'
      });
    }

    // Call Gemini API
    const response = await ai.models.generateContent({
      model: 'gemini-3.5-flash',
      contents: buildPrompt(trip),
      config: {
        systemInstruction: 'You are an expert travel planner that returns only structured JSON. Never include markdown, code blocks, or explanatory text.',
        responseMimeType: 'application/json',
        temperature: 0.7
      }
    });

    let rawContent = response.text;
    if (!rawContent) {
      return res.status(500).json({
        success: false,
        message: 'AI returned an empty response. Please try again.'
      });
    }

    // Strip markdown formatting if present
    rawContent = rawContent.replace(/```json/g, '').replace(/```/g, '').trim();

    // Parse the JSON response
    let parsed;
    try {
      parsed = JSON.parse(rawContent);
    } catch (parseErr) {
      console.error('[Itinerary] Failed to parse AI response:', rawContent);
      return res.status(500).json({
        success: false,
        message: 'AI returned invalid JSON. Please try again.'
      });
    }

    if (!parsed.days || !Array.isArray(parsed.days) || parsed.days.length === 0) {
      return res.status(500).json({
        success: false,
        message: 'AI response did not contain a valid days array. Please try again.'
      });
    }

    // Geocode locations using Nominatim
    for (const day of parsed.days) {
      if (day.activities && Array.isArray(day.activities)) {
        for (const act of day.activities) {
          const query = `${act.activity}, ${trip.destination}`;
          
          // Check cache first
          const cached = await LocationCache.findOne({ query });
          if (cached) {
            act.lat = cached.lat;
            act.lng = cached.lng;
            continue;
          }

          // Fetch from Nominatim if not cached
          try {
            console.log(`[Geocoding] Fetching: ${query}`);
            const geoRes = await fetch(`https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(query)}&format=json&limit=1`, {
              headers: {
                'User-Agent': 'TripSync/1.0'
              }
            });
            if (geoRes.ok) {
              const data = await geoRes.json();
              if (data && data.length > 0) {
                const lat = parseFloat(data[0].lat);
                const lng = parseFloat(data[0].lon);
                act.lat = lat;
                act.lng = lng;
                
                // Save to cache
                await LocationCache.create({ query, lat, lng });
              }
            }
            // Strict 1-second delay for Nominatim TOS
            await new Promise(r => setTimeout(r, 1000));
          } catch (geoErr) {
            console.error(`[Geocoding] Error for ${query}:`, geoErr.message);
          }
        }
      }
    }

    // Upsert itinerary — replaces any existing itinerary for this trip
    const itinerary = await Itinerary.findOneAndUpdate(
      { trip: tripId },
      {
        trip: tripId,
        user: req.user._id,
        days: parsed.days,
        generatedAt: new Date()
      },
      { new: true, upsert: true, runValidators: true }
    );

    res.status(200).json({
      success: true,
      message: 'Itinerary generated successfully',
      data: itinerary
    });
  } catch (error) {
    console.error('[Itinerary] Generation error:', error.message);

    // Handle specific Gemini errors
    if (error?.status === 401 || error?.message?.includes('API key not valid')) {
      return res.status(503).json({
        success: false,
        message: 'Invalid Gemini API key. Please check your GEMINI_API_KEY in backend/.env'
      });
    }
    if (error?.status === 429) {
      return res.status(503).json({
        success: false,
        message: 'Gemini API rate limit reached. Please wait a moment and try again.'
      });
    }
    if (error?.status === 503 || error?.code === 'ECONNREFUSED') {
      return res.status(503).json({
        success: false,
        message: 'Gemini API service is temporarily unavailable. Please try again later.'
      });
    }

    res.status(500).json({
      success: false,
      message: 'Failed to generate itinerary: ' + error.message
    });
  }
};

// @desc    Get existing itinerary for a trip
// @route   GET /api/itinerary/:tripId
// @access  Private
const getItinerary = async (req, res) => {
  try {
    const { tripId } = req.params;

    // Verify trip ownership first
    const trip = await Trip.findById(tripId);
    if (!trip) {
      return res.status(404).json({
        success: false,
        message: 'Trip not found'
      });
    }
    if (trip.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized to view this itinerary'
      });
    }

    const itinerary = await Itinerary.findOne({ trip: tripId });

    if (!itinerary) {
      return res.status(200).json({
        success: true,
        data: null,
        message: 'No itinerary generated yet for this trip'
      });
    }

    res.status(200).json({
      success: true,
      data: itinerary
    });
  } catch (error) {
    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        message: 'Invalid Trip ID format'
      });
    }
    res.status(500).json({
      success: false,
      message: 'Server Error: ' + error.message
    });
  }
};

module.exports = { generateItinerary, getItinerary };
