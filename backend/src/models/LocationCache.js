const mongoose = require('mongoose');

const locationCacheSchema = new mongoose.Schema({
  query: { 
    type: String, 
    required: true, 
    unique: true 
  },
  lat: { 
    type: Number, 
    required: true 
  },
  lng: { 
    type: Number, 
    required: true 
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('LocationCache', locationCacheSchema);
