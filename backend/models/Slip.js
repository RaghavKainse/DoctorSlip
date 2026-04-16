const mongoose = require('mongoose');

const slipSchema = new mongoose.Schema({
  patientDetails: {
    name: { type: String, required: true },
    age: { type: Number, required: true },
    gender: { type: String, required: true },
    phone: { type: String, required: true },
    doctor: { type: String, default: 'Self' },
    date: { type: Date, default: Date.now },
    address: String
  },
  tests: [{
    testId: { type: mongoose.Schema.Types.ObjectId, ref: 'Test' },
    name: { type: String, required: true },
    price: { type: Number, required: true }
  }],
  subtotal: { type: Number, required: true },
  discount: { type: Number, default: 0 },
  total: { type: Number, required: true },
}, { timestamps: true });

module.exports = mongoose.model('Slip', slipSchema);
