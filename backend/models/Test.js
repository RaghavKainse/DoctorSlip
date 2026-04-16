const mongoose = require('mongoose');

const testSchema = new mongoose.Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  category: { type: String, default: 'General' },
  parameters: [{
    paramName: String,
    unit: String,
    referenceRange: String,
    group: String
  }]
});

module.exports = mongoose.model('Test', testSchema);
