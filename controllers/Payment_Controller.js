const chapa = require('../lib/chapa'); // Import chapa instance
const User = require('../models/User_Model'); // Adjust the path as necessary
const request = require('request');
const axios = require('axios');

// Payment processing
exports.processPayment = async (req, res) => {
    const { amount } = req.body;

    // Validate input
    if (!amount || isNaN(amount) || Number(amount) <= 0) {
        return res.status(400).json({ message: 'Valid amount is required' });
    }

    if (!req.user || !req.user.first_name || !req.user.last_name || !req.user.email || !req.user.phone_number) {
        return res.status(400).json({ message: 'User information is incomplete' });
    }

    // Generate transaction reference
    const tx_ref = await chapa.genTxRef();
    console.log(`Generated Transaction Reference: ${tx_ref}`);

    try {
        // Initialize the transaction with Chapa
        const options = {
            method: 'POST',
            url: 'https://api.chapa.co/v1/transaction/initialize',
            headers: {
                'Authorization': `Bearer ${process.env.CHAPA_SECRET_KEY}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                amount: amount.toString(),
                currency: 'ETB',
                email: req.user.email,
                first_name: req.user.first_name,
                last_name: req.user.last_name,
                phone_number: req.user.phone_number,
                tx_ref: tx_ref,
                callback_url: 'http://localhost:3002/api/payment/verify/' + tx_ref,
            
                meta: {
                    hide_receipt: true
                }
            })
        };

        request(options, function (error, response) {
            if (error) {
                console.error('Payment processing error:', error);
                return res.status(500).json({ msg: 'An unexpected error occurred', details: error });
            }

            const body = JSON.parse(response.body);
            if (response.statusCode === 200 && body.status === 'success') {
                return res.json({
                    msg: "Order created successfully. Perform payment.",
                    paymentUrl: body.data.checkout_url,
                });
            } else {
                return res.status(500).json({
                    msg: body.message || "Something went wrong",
                });
            }
        });
    } catch (error) {
        console.error('Payment processing error:', error);
        return res.status(500).json({ msg: error.message || 'An unexpected error occurred' });
    }
};

// Payment verification
exports.verifyPayment = async (req, res) => {
    const { tx_ref } = req.params;

    // Validate input
    if (!tx_ref) {
        return res.status(400).json({ message: 'Transaction reference is required' });
    }

    try {
        const options = {
            method: 'GET',
            url: `https://api.chapa.co/v1/transaction/verify/${tx_ref}`,
            headers: {
                'Authorization': `Bearer ${process.env.CHAPA_SECRET_KEY}`
            }
        };

        request(options, function (error, response) {
            if (error) {
                console.error('Payment verification error:', error);
                return res.status(500).json({ error: 'Verification failed', details: error });
            }

            const body = JSON.parse(response.body);
            res.json({
                message: body.message,
                status: body.status,
                data: body.data,
            });
        });
    } catch (error) {
        console.error('Payment verification error:', error);
        res.status(500).json({ error: 'Verification failed', details: error.message });
    }
};

// Get all transactions
exports.getAllTransactions = async (req, res) => {
    const options = {
        method: 'GET',
        url: 'https://api.chapa.co/v1/transactions',
        headers: {
            'Authorization': `Bearer ${process.env.CHAPA_SECRET_KEY}`
        }
    };

    try {
        const response = await axios.request(options);
        const transactions = response.data.data.transactions; // Extract the transactions

        res.json({
            msg: "Transactions retrieved successfully.",
            data: transactions, // Return only the transactions data
        });
    } catch (error) {
        console.error('Error fetching transactions:', error);
        res.status(500).json({ msg: 'An unexpected error occurred', details: error.message });
    }
};

// Get wallet balance
exports.getWalletBalance = async (req, res) => {
    const options = {
        method: 'GET',
        url: 'https://api.chapa.co/v1/balances',
        headers: {
            'Authorization': `Bearer ${process.env.CHAPA_SECRET_KEY}`
        }
    };

    request(options, function (error, response) {
        if (error) {
            console.error('Error fetching wallet balance:', error);
            return res.status(500).json({ msg: 'An unexpected error occurred', details: error });
        }

        if (response.statusCode === 200) {
            const body = JSON.parse(response.body);
            return res.json({
                msg: "Wallet balance retrieved successfully.",
                balance: body // Adjust based on actual response structure
            });
        } else {
            console.error('Failed to retrieve wallet balance:', response.body);
            return res.status(response.statusCode).json({
                msg: body.message || "Failed to retrieve wallet balance.",
                details: body
            });
        }
    });
};

// Get list of banks
exports.getBanks = async (req, res) => {
    const options = {
        method: 'GET',
        url: 'https://api.chapa.co/v1/banks',
        headers: {
            'Authorization': `Bearer ${process.env.CHAPA_SECRET_KEY}`,
        }
    };

    request(options, function (error, response) {
        if (error) {
            console.error('Error fetching banks:', error);
            return res.status(500).json({ msg: 'An unexpected error occurred', details: error });
        }

        if (response.statusCode === 200) {
            const body = JSON.parse(response.body);
            return res.json({
                msg: "Banks retrieved successfully.",
                data: body,
            });
        } else {
            console.error('Failed to retrieve banks:', response.body);
            const body = JSON.parse(response.body);
            return res.status(response.statusCode).json({
                msg: body.message || "Failed to retrieve banks.",
                details: body
            });
        }
    });
};

// Transfer money


// Transfer money function
// exports.transferMoney = async (req, res) => {
//     const { userId, amount, bank_code } = req.body; // Get userId from request body

//     // Validate input
//     if (!userId || !amount || isNaN(amount) || Number(amount) <= 0 || !bank_code) {
//         return res.status(400).json({ message: 'Valid user ID, amount, and bank code are required' });
//     }

//     try {
//         // Find user by ID
//         const user = await User.findById(userId);
//         if (!user) {
//             return res.status(404).json({ message: 'User not found' });
//         }

//         const { account_name, account_number } = user; // Get account details from user

//         const options = {
//             method: 'POST',
//             url: 'https://api.chapa.co/v1/transfers',
//             headers: {
//                 'Authorization': `Bearer ${process.env.CHAPA_SECRET_KEY}`,
//                 'Content-Type': 'application/json'
//             },
//             body: JSON.stringify({
//                 account_name,
//                 account_number,
//                 amount: amount.toString(),
//                 currency: "ETB", // Default currency
//                 reference: `transfer-${Date.now()}`,
//                 bank_code: Number(bank_code),
//             })
//         };

//         request(options, function (error, response) {
//             if (error) {
//                 console.error('Transfer error:', error);
//                 return res.status(500).json({ msg: 'An unexpected error occurred', details: error });
//             }

//             if (response.statusCode === 200) {
//                 const body = JSON.parse(response.body);
//                 return res.json({
//                     msg: "Transfer initiated successfully.",
//                     data: body,
//                 });
//             } else {
//                 console.error('Failed to initiate transfer:', response.body);
//                 const body = JSON.parse(response.body);
//                 return res.status(response.statusCode).json({
//                     msg: body.message || "Failed to initiate transfer.",
//                     details: body
//                 });
//             }
//         });
//     } catch (error) {
//         console.error('Error fetching user:', error);
//         return res.status(500).json({ message: 'An unexpected error occurred', details: error });
//     }
// };