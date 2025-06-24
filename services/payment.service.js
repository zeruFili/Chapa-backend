const axios = require('axios');
const Bank = require("../models/Bank_Model");
const request = require('request');

const createPayment = async (user, amount, tx_ref) => {
    const response = await axios.post('https://api.chapa.co/v1/transaction/initialize', {
        amount: amount.toString(),
        currency: 'ETB',
        email: user.email,
        first_name: user.first_name,
        last_name: user.last_name,
        phone_number: user.phone_number,
        tx_ref: tx_ref,
        callback_url: `http://localhost:3002/api/payment/verify/${tx_ref}`,
        meta: {
            hide_receipt: true
        }
    }, {
        headers: {
            'Authorization': `Bearer ${process.env.CHAPA_SECRET_KEY}`,
            'Content-Type': 'application/json'
        }
    });

    if (response.status === 200 && response.data.status === 'success') {
        return {
            paymentUrl: response.data.data.checkout_url,
        };
    } else {
        throw new Error(response.data.message || "Something went wrong");
    }
};

const verifyPayment = async (tx_ref) => {
    const response = await axios.get(`https://api.chapa.co/v1/transaction/verify/${tx_ref}`, {
        headers: {
            'Authorization': `Bearer ${process.env.CHAPA_SECRET_KEY}`,
        }
    });

    return {
        message: response.data.message,
        status: response.data.status,
        data: response.data.data,
    };
};

const getAllTransactions = async () => {
    const response = await axios.get('https://api.chapa.co/v1/transactions', {
        headers: {
            'Authorization': `Bearer ${process.env.CHAPA_SECRET_KEY}`
        }
    });
    return response.data.data.transactions;
};

const getWalletBalance = async () => {
    const response = await axios.get('https://api.chapa.co/v1/balances', {
        headers: {
            'Authorization': `Bearer ${process.env.CHAPA_SECRET_KEY}`
        }
    });
    return response.data;
};

const getBanks = async () => {
    const response = await axios.get('https://api.chapa.co/v1/banks', {
        headers: {
            'Authorization': `Bearer ${process.env.CHAPA_SECRET_KEY}`,
        }
    });
    return response.data;
};



module.exports = {
    createPayment,
    verifyPayment,
    getAllTransactions,
    getWalletBalance,
    getBanks,
};