const mongoose = require('mongoose');

const aircraftSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true
  },
  manufacturer: String,
  range: {
    type: Number,  // Range in nautical miles
    required: true
  },
  passengerCapacity: {
    type: Number,
    required: true
  },
  cruisingSpeed: Number,
  price: {
    type: Number,
    required: true
  },
  modelPath: {    // Path to GLB file in models folder
    type: String,
    required: true
  },
  specifications: {
    length: Number,
    wingspan: Number,
    height: Number,
    engineType: String
  },
  thumbnail: String  // Optional thumbnail image path
});

module.exports = mongoose.model('Aircraft', aircraftSchema); 