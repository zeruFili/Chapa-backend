const { checkAuth } = require("../controllers/User_Controller");
const Bank = require("../models/Bank_Model");

// Create a new bank record
const createBank = async (userId, accountNumber, bankCode, amount, bankName) => {
  // Check if the user already has a bank record
  const existingBank = await Bank.findOne({ user: userId, accountNumber });
  
  if (existingBank) {
    throw new Error("Bank record already exists.");
  }

  const newBank = new Bank({
    user: userId,
    accountNumber,
    bankCode,
    amount,
    bankName,
  });

  await newBank.save();
  return newBank;
};

// Update an existing bank record
const updateBank = async (userId, bankId, updates) => {
  const updatedBank = await Bank.findOneAndUpdate(
    { _id: bankId, user: userId },
    updates,
    { new: true }
  );
  if (!updatedBank) {
    throw new Error("Bank record not found or does not belong to the user");
  }
  return updatedBank;
};

// Delete a bank record
const deleteBank = async (userId, bankId) => {
  const deletedBank = await Bank.findOneAndDelete({ _id: bankId, user: userId });
  if (!deletedBank) {
    throw new Error("Bank record not found or does not belong to the user");
  }
  return deletedBank;
};

// View the list of banks based on user ID
const getBanksByUserId = async (userId) => {
  return await Bank.find({ user: userId });
};

module.exports = {
  createBank,
  updateBank,
  deleteBank,
  getBanksByUserId,
};