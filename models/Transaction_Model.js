const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
  sender: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  amount: { type: Number, required: true },
  status: { type: String, enum: ['rejected', 'accepted', 'pending'], default: 'pending', required: true },
  receiver: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  description: { type: String, required: false },
  createdAt: { type: Date, default: Date.now },
  account_name: { type: String, required: true }, // Added account_name field
  account_number: { type: String, required: true }, // Added account_number field
  currency: { type: String, required: true }, // Added currency field
  bank_code: { type: String, required: true } // Added bank_code field
});

module.exports = mongoose.model('Transaction', transactionSchema);