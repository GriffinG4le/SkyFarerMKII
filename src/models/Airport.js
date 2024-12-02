const mongoose = require('mongoose');

const airportSchema = new mongoose.Schema({
  code: {
    type: String,
    required: true,
    unique: true
  },
  name: {
    type: String,
    required: true
  },
  city: String,
  country: String,
  location: {
    type: {
      type: String,
      enum: ['Point'],
      default: 'Point'
    },
    coordinates: {
      type: [Number],  // [longitude, latitude]
      required: true
    }
  },
  elevation: Number
});

airportSchema.index({ location: '2dsphere' });

module.exports = mongoose.model('Airport', airportSchema); 