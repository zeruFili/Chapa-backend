const Transaction = require('../models/Transaction_Model'); // Adjust the path as necessary
const request = require('request');

// Create Transaction
const createTransaction = async (senderId, amount, receiver, description, account_name, account_number, currency, bank_code) => {
    const transaction = await Transaction.create({
        sender: senderId,
        amount,
        receiver,
        description,
        account_name,
        account_number,
        currency,
        bank_code,
    });
    return transaction;
};

// Update Transaction Status
const updateTransactionStatus = async (transactionId, status) => {
    const transaction = await Transaction.findById(transactionId);
    if (!transaction) {
        throw new Error("Transaction not found");
    }

    const allowedStatuses = ['rejected', 'accepted', 'pending'];
    if (!allowedStatuses.includes(status)) {
        throw new Error("Status must be one of 'rejected', 'accepted', or 'pending'");
    }

    transaction.status = status;

    if (status === 'accepted') {
        const accountNumber = transaction.account_number.toString().trim();
        if (!/^\d{7,18}$/.test(accountNumber)) {
            throw new Error("Account number must be numeric and between 7 and 18 digits.");
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

        return new Promise((resolve, reject) => {
            request(options, function (error, response) {
                if (error) {
                    console.error('Request Error:', error); // Log the error
                    return reject(new Error('An unexpected error occurred'));
                }

                if (response.statusCode === 200) {
                    const body = JSON.parse(response.body);
                    transaction.transferReference = body.data; // Save the transfer reference
                    transaction.status = 'accepted'; // Update status
                    transaction.save().then(() => {
                        resolve(body);
                    }).catch(saveError => {
                        console.error('Save Error:', saveError); // Log save error details
                        reject(new Error('Failed to save transaction'));
                    });
                } else {
                    console.error('Response Error:', response);
                    const body = JSON.parse(response.body);
                    console.error('Response Error:', body); // Log response error details
                    reject(new Error(body.message || "Failed to initiate transfer."));
                }
            });
        });
    } else {
        await transaction.save();
        return transaction;
    }
};

// Get All Transactions
const getAllTransactions = async () => {
    const transactions = await Transaction.find()
        .populate('sender', 'first_name last_name')
        .populate('receiver', 'first_name last_name')
        .sort({ createdAt: -1 });

    if (transactions.length === 0) {
        throw new Error("No transactions found");
    }

    return transactions;
};

module.exports = {
    createTransaction,
    updateTransactionStatus,
    getAllTransactions,
};