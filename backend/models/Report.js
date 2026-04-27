const mongoose = require('mongoose');

const reportSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    enum: ['Summary', 'Trend', 'Hotspot', 'Custom'],
    default: 'Summary',
  },
  generatedBy: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true,
  },
  fileUrl: String,
  parameters: Object,
}, {
  timestamps: true,
});

module.exports = mongoose.model('Report', reportSchema);
