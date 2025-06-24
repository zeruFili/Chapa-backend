const chapa = require('../lib/chapa'); // Import chapa instance
const PaymentService = require('../services/payment.service'); // Import payment service
const catchAsync = require("../utils/catchAsync");
const httpStatus = require("http-status");

// Payment processing
exports.processPayment = catchAsync(async (req, res) => {
    const { amount } = req.body;

    // Generate transaction reference
    const tx_ref = await chapa.genTxRef();
    console.log(`Generated Transaction Reference: ${tx_ref}`);

    // Initialize the transaction with Chapa
    const paymentResponse = await PaymentService.createPayment(req.user, amount, tx_ref);
    
    res.status(httpStatus.default.OK).json({
        msg: "Order created successfully. Perform payment.",
        paymentUrl: paymentResponse.paymentUrl,
    });
});

// Payment verification
exports.verifyPayment = catchAsync(async (req, res) => {
    const { tx_ref } = req.params;

    // Validate input
    if (!tx_ref) {
        return res.status(httpStatus.default.BAD_REQUEST).json({ msg: 'Transaction reference is required' });
    }

    const verificationResponse = await PaymentService.verifyPayment(tx_ref);
    
    res.status(httpStatus.default.OK).json({
        msg: verificationResponse.message,
        status: verificationResponse.status,
        data: verificationResponse.data,
    });
});

// Get all transactions
exports.getAllTransactions = catchAsync(async (req, res) => {
    const transactions = await PaymentService.getAllTransactions();
    
    res.status(httpStatus.default.OK).json({
        msg: "Transactions retrieved successfully.",
        data: transactions,
    });
});

// Get wallet balance
exports.getWalletBalance = catchAsync(async (req, res) => {
    const balance = await PaymentService.getWalletBalance();
    
    res.status(httpStatus.default.OK).json({
        msg: "Wallet balance retrieved successfully.",
        balance,
    });
});

// Get list of banks
exports.getBanks = catchAsync(async (req, res) => {
    const banks = await PaymentService.getBanks();
    
    res.status(httpStatus.default.OK).json({
        msg: "Banks retrieved successfully.",
        data: banks,
    });
});

// Transfer money
exports.transferMoney = catchAsync(async (req, res) => {
    const { amount, bankCode } = req.body;

    const transferResponse = await PaymentService.transferMoney(req.user._id, amount, bankCode);
    
    res.status(httpStatus.default.OK).json({
        msg: "Transfer initiated successfully.",
        data: transferResponse,
    });
});