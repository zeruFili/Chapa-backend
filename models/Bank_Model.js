const mongoose = require('mongoose');

const bankSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  accountNumber: { type: String, required: true },
  bankCode: { type: String, required: true },
  amount: { type: Number, required: true },
  bankName: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Bank', bankSchema);