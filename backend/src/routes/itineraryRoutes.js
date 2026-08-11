const express = require('express');
const router = express.Router();
const { generateItinerary, getItinerary } = require('../controllers/itineraryController');
const { protect } = require('../middleware/authMiddleware');

// Apply JWT protection to all itinerary routes
router.use(protect);

router.post('/generate', generateItinerary);
router.get('/:tripId', getItinerary);

module.exports = router;
