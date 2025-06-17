const Transaction = require('../models/Transaction_Model'); // Adjust the path as necessary
const User = require('../models/User_Model'); // Adjust the path as necessary
const request = require('request');
const createTransaction = async (req, res) => {
    try {
      const { amount,  receiver, description, account_name, account_number, currency, bank_code } = req.body;
      const sender = req.user._id; // Get sender ID from authenticated user

   
  
      if (!amount ||  !receiver || !account_name || !account_number || !currency || !bank_code) {
        return res.status(400).json({ message: "Please provide all required fields: amount, status, receiver, account_name, account_number, currency, bank_code" });
      }
  
      // Create transaction
      const transaction = await Transaction.create({
        sender,
        amount,
       
        receiver,
        description,
        account_name,
        account_number,
        currency,
        bank_code,
      });
  
      return res.status(201).json(transaction);
    } catch (error) {
      return res.status(500).json({ message: "Failed to create transaction", error: error.message });
    }
  };
// Update transaction status
// Adjust the path as necessary

const updateTransactionStatus = async (req, res) => {
    try {
        const { transactionId } = req.params; // Get transaction ID from request parameters
        const { status } = req.body;


        if (!status) {
            return res.status(400).json({ message: "Please provide a status" });
        }

        // Ensure the status is one of the allowed values
        const allowedStatuses = ['rejected', 'accepted', 'pending'];
        if (!allowedStatuses.includes(status)) {
    console.log(`Error: Invalid status - ${status}. Status must be one of 'rejected', 'accepted', or 'pending'.`);
    return res.status(400).json({ message: "Status must be one of 'rejected', 'accepted', or 'pending'" });
}

        // Find the transaction
        const transaction = await Transaction.findById(transactionId);

        if (!transaction) {
            return res.status(404).json({ message: "Transaction not found" });
        }

        // Check if the status is different from the previous one
        if (transaction.status !== status) {
            transaction.status = status; // Update the status

            // If the status is 'accepted', initiate the transfer
            if (status === 'accepted') {
                const accountNumber = transaction.account_number.toString().trim();

                // Validate account number
                if (!/^\d{7,18}$/.test(accountNumber)) {
                    return res.status(400).json({ message: "Account number must be numeric and between 7 and 18 digits." });
                }

                const options = {
                    method: 'POST',
                    url: 'https://api.chapa.co/v1/transfers',
                    headers: {
                        'Authorization': `Bearer ${process.env.CHAPA_SECRET_KEY}`,
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        account_name: transaction.account_name,
                        account_number: accountNumber,
                        amount: transaction.amount.toString(),
                        currency: "ETB",
                        reference: `transfer-${Date.now()}`,
                        bank_code: Number(transaction.bank_code),
                    })
                };

                request(options, function (error, response) {
                    if (error) {
                        console.error('Transfer error:', error);
                        return res.status(500).json({ msg: 'An unexpected error occurred', details: error });
                    }

                    if (response.statusCode === 200) {
                        const body = JSON.parse(response.body);
                        
                        // Save the transaction status as 'accepted'
                        transaction.status = 'accepted'; // Change made here
                        transaction.transferReference = body.data; // Save the transfer reference if needed

                        // Save the updated transaction
                        transaction.save().then(() => {
                            return res.json({
                                msg: "Transfer initiated successfully.",
                                data: body,
                            });
                        }).catch(saveError => {
                            console.error('Failed to save transaction:', saveError);
                            return res.status(500).json({ msg: 'Failed to save transaction', details: saveError });
                        });
                    } else {
                        console.error('Failed to initiate transfer:', response.body);
                        const body = JSON.parse(response.body);
                        return res.status(response.statusCode).json({
                            msg: body.message || "Failed to initiate transfer.",
                            details: body
                        });
                    }
                });
            } else {
                // Save the updated transaction status
                await transaction.save();
                return res.json(transaction);
            }
        } else {
            return res.status(400).json({ message: "Status is the same as the previous one." });
        }
    } catch (error) {
        return res.status(500).json({ message: "Failed to update transaction", error: error.message });
    }
};
// Get transaction details
const getAllTransactions = async (req, res) => {
    try {
      // Fetch all transactions, populate sender and receiver details, and sort by createdAt in descending order
      const transactions = await Transaction.find()
        .populate('sender', 'first_name last_name')
        .populate('receiver', 'first_name last_name')
        .sort({ createdAt: -1 }); // Sort by createdAt in descending order
  
      // Check if there are no transactions
      if (transactions.length === 0) {
        return res.status(404).json({ message: "No transactions found" });
      }
  
      // Format the response
      const response = transactions.map(transaction => ({
        _id: transaction._id,
        amount: transaction.amount,
        status: transaction.status,
        sender: {
          first_name: transaction.sender.first_name,
          last_name: transaction.sender.last_name,
        },
        receiver: {
          first_name: transaction.receiver.first_name,
          last_name: transaction.receiver.last_name,
        },
        description: transaction.description,
        createdAt: transaction.createdAt,
        account_name: transaction.account_name,
        account_number: transaction.account_number,
        currency: transaction.currency,
        bank_code: transaction.bank_code,
      }));
  
      return res.json(response);
    } catch (error) {
      return res.status(500).json({ message: "Failed to retrieve transactions", error: error.message });
    }
  };

  
module.exports = {
  createTransaction,
  updateTransactionStatus,
  getAllTransactions,
};