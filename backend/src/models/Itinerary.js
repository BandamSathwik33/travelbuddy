const mongoose = require('mongoose');

const activitySchema = new mongoose.Schema({
  time: { type: String, default: '' },
  activity: { type: String, required: true },
  description: { type: String, default: '' },
  estimatedCost: { type: Number, default: 0 },
  lat: { type: Number, default: null },
  lng: { type: Number, default: null }
}, { _id: false });

const mealsSchema = new mongoose.Schema({
  breakfast: { type: String, default: '' },
  lunch: { type: String, default: '' },
  dinner: { type: String, default: '' }
}, { _id: false });

const daySchema = new mongoose.Schema({
  day: { type: Number, required: true },
  date: { type: String, default: '' },
  title: { type: String, default: '' },
  activities: { type: [activitySchema], default: [] },
  meals: { type: mealsSchema, default: () => ({}) },
  accommodation: { type: String, default: '' },
  estimatedDayBudget: { type: Number, default: 0 }
}, { _id: false });

const itinerarySchema = new mongoose.Schema(
  {
    trip: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Trip',
      required: true,
      unique: true  // One itinerary per trip; re-generate replaces it
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    days: {
      type: [daySchema],
      default: []
    },
    generatedAt: {
      type: Date,
      default: Date.now
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('Itinerary', itinerarySchema);
