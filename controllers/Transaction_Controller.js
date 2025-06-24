const TransactionService = require('../services/transaction.service'); // Import the service
const httpStatus = require("http-status");

// Create Transaction
const createTransaction = async (req, res) => {
    try {
        const { amount, receiver, description, account_name, account_number, currency, bank_code } = req.body;
        const sender = req.user._id;

        const transaction = await TransactionService.createTransaction(sender, amount, receiver, description, account_name, account_number, currency, bank_code);
        return res.status(httpStatus.default.CREATED).json(transaction);
    } catch (error) {
        return res.status(httpStatus.default.INTERNAL_SERVER_ERROR).json({ message: "Failed to create transaction", error: error.message });
    }
};

// Update Transaction Status
const updateTransactionStatus = async (req, res) => {
    try {
        const { transactionId } = req.params;
        const { status } = req.body;

        const transaction = await TransactionService.updateTransactionStatus(transactionId, status);
        return res.json(transaction);
    } catch (error) {
        console.error(error);
        return res.status(httpStatus.default.INTERNAL_SERVER_ERROR).json({ message: "Failed to update transaction", error: error.message });
    }
};

// Get All Transactions
const getAllTransactions = async (req, res) => {
    try {
        const transactions = await TransactionService.getAllTransactions();
        
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
        return res.status(httpStatus.default.INTERNAL_SERVER_ERROR).json({ message: "Failed to retrieve transactions", error: error.message });
    }
};

module.exports = {
    createTransaction,
    updateTransactionStatus,
    getAllTransactions,
};