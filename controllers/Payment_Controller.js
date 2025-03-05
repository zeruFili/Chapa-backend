const chapa = require('../lib/chapa'); // Import chapa instance
const request = require('request');

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
        const response = await chapa.initialize({
            first_name: req.user.first_name,
            last_name: req.user.last_name,
            email: req.user.email,
            phone_number: req.user.phone_number,
            currency: 'ETB',
            amount: amount.toString(),
            tx_ref: tx_ref,
            callback_url: 'http://localhost:3002/api/payment/verify',
            customization: {
                title: 'Test Title',
                description: 'Test Description',
            },
        });

        
        // Check the response status
        if (response.status === "success") {
            return res.json({
                msg: "Order created successfully. Perform payment.",
                paymentUrl: response.data.checkout_url,
            });
        } else {
            return res.status(500).json({
                msg: response.message || "Something went wrong",
            });
        }
    } catch (error) {
        console.error('Payment processing error:', error);

        // Improved error handling
        if (error.response) {
            // Return specific message from Chapa if available
            return res.status(error.response.status || 500).json({
                msg: error.response.data.message || 'An error occurred during the payment process',
                details: error.response.data || {},
            });
        } else {
            return res.status(500).json({
                msg: error.message || 'An unexpected error occurred',
            });
        }
    }
};

// Payment verification
exports.verifyPayment = async (req, res) => {
    const { tx_ref } = req.params; // This should retrieve the tx_ref from the URL

    // Validate input
    if (!tx_ref) {
        return res.status(400).json({ message: 'Transaction reference is required' });
    }

    try {
        // Verify the transaction using Chapa SDK
        const response = await chapa.verify({ tx_ref });
        console.log('Request parameters:', req.params);
        console.log(`Chapa Response: ${JSON.stringify(response)}`);


        // Respond with the verification details
        res.json({
            message: response.message,
            status: response.status,
            data: response.data,
        });
    } catch (error) {
        // Handle error from Chapa
        console.error('Payment verification error:', error);
        res.status(500).json({ error: 'Verification failed', details: error.message });
    }
};

exports.getAllTransactions = async (req, res) => {
    try {
        // Fetch all transactions from Chapa
        const response = await chapa.getTransactions();

        // Check the response status
        if (response.status === "success") {
            return res.json({
                msg: "Transactions retrieved successfully.",
                data: response.data.transactions,
            });
        } else {
            return res.status(500).json({
                msg: response.message || "Failed to retrieve transactions.",
            });
        }
    } catch (error) {
        console.error('Error fetching transactions:', error);

        // Improved error handling
        const status = error.response ? error.response.status : 500;
        const message = error.response ? error.response.data.message : 'An unexpected error occurred';
        
        return res.status(status).json({ msg: message, details: error.response?.data || {} });
    }
};



// Get wallet balance
exports.getWalletBalance = async (req, res) => {
    const options = {
        method: 'GET',
        url: 'https://api.chapa.co/v1/balances',
        headers: {
            'Authorization': `Bearer ${process.env.CHAPA_SECRET_KEY}` // Use the secret key from .env
        }
    };

    request(options, function (error, response) {
        if (error) {
            console.error('Error fetching wallet balance:', error);
            return res.status(500).json({ msg: 'An unexpected error occurred', details: error });
        }

        // Check if the response status code is 200
        if (response.statusCode === 200) {
            const body = JSON.parse(response.body);
            return res.json({
                msg: "Wallet balance retrieved successfully.",
                balance: body// Adjust based on actual response structure
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
            'Authorization': `Bearer ${process.env.CHAPA_SECRET_KEY}`, // Use your secret key from .env
        }
    };

    request(options, function (error, response) {
        if (error) {
            console.error('Error fetching banks:', error);
            return res.status(500).json({ msg: 'An unexpected error occurred', details: error });
        }

        // Check if the response status code is 200
        if (response.statusCode === 200) {
            const body = JSON.parse(response.body);
            return res.json({
                msg: "Banks retrieved successfully.",
                data: body, // Adjust based on actual response structure
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

// Transfer money using URL
exports.transferbasedonurl = async (req, res) => {
    const { account_name, account_number, amount, currency, bank_code } = req.body;

    // Validate input
    if (!account_name || !account_number || !amount || isNaN(amount) || Number(amount) <= 0 || !currency || !bank_code) {
        return res.status(400).json({ message: 'Valid account details, amount, and bank code are required' });
    }

    const options = {
        method: 'POST',
        url: 'https://api.chapa.co/v1/transfers',
        headers: {
            'Authorization': `Bearer ${process.env.CHAPA_SECRET_KEY}`, // Use your secret key from .env
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            account_name,
            account_number,
            amount: amount.toString(),
            currency,
            reference: `transfer-${Date.now()}`,
            bank_code: Number(bank_code),
        })
    };

    request(options, function (error, response) {
        if (error) {
            console.error('Transfer error:', error);
            return res.status(500).json({ msg: 'An unexpected error occurred', details: error });
        }

        // Check if the response status code is 200
        if (response.statusCode === 200) {
            const body = JSON.parse(response.body);
            return res.json({
                msg: "Transfer initiated successfully.",
                data: body, // Adjust based on actual response structure
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
};


// Add this function in your Payment_Controller.js
// Add this function in your Payment_Controller.js
// Add this function in your Payment_Controller.js
exports.transferMoney = async (req, res) => {
    const { account_name, account_number, amount, currency, bank_code } = req.body;

    // Validate input
    if (!account_name || !account_number || !amount || isNaN(amount) || Number(amount) <= 0 || !currency || !bank_code) {
        return res.status(400).json({ message: 'Valid account details, amount, and bank code are required' });
    }

    try {
        console.log(`Initiating transfer...`);

        const response = await chapa.transfer({
            account_name,
            account_number,
            amount: amount.toString(), // Ensure amount is a string
            currency,
            reference: `transfer-${Date.now()}`, // Unique reference for the transfer
            bank_code: Number(bank_code), // Ensure bank_code is a number
        });

        console.log(`Transfer response received`);

        // Check response status and handle accordingly
        if (response.status === "success") {
            return res.json({
                msg: "Transfer initiated successfully.",
                data: response.data,
            });
        } else {
            // Handle failure
            console.error('Transfer failed:', response);
            return res.status(500).json({
                msg: response.message || "Failed to initiate transfer.",
                details: response
            });
        }
    } catch (error) {
        console.error('Transfer error:', error);

        // Handle various error scenarios
        let status = 500; // Default to 500 for unexpected errors
        let message = 'An unexpected error occurred';

        // Check if the error has a message and ensure it is a string
        if (error.message) {
            message = typeof error.message === 'string' ? error.message : JSON.stringify(error.message);
        }

        // Additional checks for network errors or other issues
        if (error.code) {
            console.error('Error code:', error.code); // Log error code for debugging
            if (error.code === 'ECONNREFUSED') {
                message = 'Connection to the API was refused. Please check the API endpoint.';
            } else if (error.code === 'ENOTFOUND') {
                message = 'API endpoint not found. Please check the URL.';
            }
            // Add more specific error handling as needed
        }

        return res.status(status).json({
            msg: message
        });
    }
};