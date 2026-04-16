const mongoose = require('mongoose');

const reportSchema = new mongoose.Schema({
  patientDetails: {
    name: { type: String, required: true },
    age: String,
    gender: String,
    phone: String,
    doctor: String,
    date: { type: Date, default: Date.now },
    note: String,
    address: String
  },
  tests: [{
    testId: { type: mongoose.Schema.Types.ObjectId, ref: 'Test' },
    name: String,
    category: String,
    parameters: [{
      paramName: String,
      unit: String,
      referenceRange: String,
      group: String
    }],
    results: mongoose.Schema.Types.Mixed 
  }],
}, { timestamps: true });

module.exports = mongoose.model('Report', reportSchema);
