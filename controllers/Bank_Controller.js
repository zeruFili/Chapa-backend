const Bank = require('../models/Bank_Model'); // Adjust the path as necessary

// Create a new bank record
exports.createBank = async (req, res) => {
  try {
    const user = req.user._id;
    const {  accountNumber, bankCode, amount, bankName } = req.body;
    const newBank = new Bank({
      user,
      accountNumber,
      bankCode,
      amount,
      bankName
    });
    await newBank.save();
    return res.status(201).json({ message: 'Bank record created successfully', newBank });
  } catch (error) {
    return res.status(500).json({ message: 'Error creating bank record', error });
  }
};

// Update an existing bank record
exports.updateBank = async (req, res) => {
    const user = req.user._id;
  const {  bankId } = req.body; // Get user ID from request body

  try {
    const updatedBank = await Bank.findOneAndUpdate(
      { _id: bankId, user }, // Ensure the bank belongs to the user
      req.body,
      { new: true }
    );
    if (!updatedBank) {
      return res.status(404).json({ message: 'Bank record not found or does not belong to the user' });
    }
    return res.status(200).json({ message: 'Bank record updated successfully', updatedBank });
  } catch (error) {
    return res.status(500).json({ message: 'Error updating bank record', error });
  }
};

// Delete a bank record
exports.deleteBank = async (req, res) => {
    const user = req.user._id;
  const { bankId } = req.body; // Get user ID from request body

  try {
    const deletedBank = await Bank.findOneAndDelete({ _id: bankId, user }); // Ensure the bank belongs to the user
    if (!deletedBank) {
      return res.status(404).json({ message: 'Bank record not found or does not belong to the user' });
    }
    return res.status(200).json({ message: 'Bank record deleted successfully' });
  } catch (error) {
    return res.status(500).json({ message: 'Error deleting bank record', error });
  }
};

// View the list of banks based on user ID
exports.getBanksByUserId = async (req, res) => {
  // const { user } = req.query; // Get user ID from query parameters
   const user = req.user._id;
  console.log(user);
  
  try {
    const banks = await Bank.find({ user });
    return res.status(200).json({ message: 'Bank records retrieved successfully', banks });
  } catch (error) {
    return res.status(500).json({ message: 'Error retrieving bank records', error });
  }
};
