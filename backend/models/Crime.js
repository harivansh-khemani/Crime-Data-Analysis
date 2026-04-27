const mongoose = require('mongoose');

const crimeSchema = new mongoose.Schema({
  crimeId: {
    type: String,
    required: true,
    unique: true,
  },
  type: {
    type: String,
    required: true,
    index: true,
  },
  location: {
    type: String,
    required: true,
    index: true,
  },
  coordinates: {
    lat: { type: Number, required: true },
    lng: { type: Number, required: true },
  },
  date: {
    type: Date,
    required: true,
    index: true,
  },
  time: String,
  victimAge: Number,
  victimGender: String,
  weaponUsed: String,
  status: {
    type: String,
    enum: ['Open', 'In Progress', 'Solved', 'Closed'],
    default: 'Open',
    index: true,
  },
  description: String,
  reportedBy: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
  },
}, {
  timestamps: true,
});

// Index for geo-queries if needed
crimeSchema.index({ "coordinates.lat": 1, "coordinates.lng": 1 });

module.exports = mongoose.model('Crime', crimeSchema);
