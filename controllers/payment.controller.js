const { userModel } = require("../models"); // Use destructuring to import userModel
const { paymentService } = require("../services");
const catchAsync = require("../utils/catchAsync.js");
const httpStatus = require("http-status");

const createCheckoutSession = catchAsync(async (req, res) => {
    const { cartId } = req.body;
    const userId = req.user._id;

    // Fetch the user from the database
    const user = await userModel.findById(userId); // Use userModel here
    if (!user) {
        return res.status(httpStatus.default.NOT_FOUND).json({ message: "User not found" });
    }

    const { paymentUrl, totalAmount, lineItems } = await paymentService.createCheckoutSession(cartId, user);
    price = totalAmount/100

    res.status(httpStatus.default.OK).json({
        msg: "Order created successfully. Perform payment.",
        paymentUrl,
        price,
        lineItems,
    });
});

const checkoutSuccess = catchAsync(async (req, res) => {
    const { tx_ref, cartId } = req.body;

    const orderDetails = await paymentService.verifyPayment(tx_ref, cartId);
    
    res.status(httpStatus.default.OK).json({
        success: true,
        message: "Payment successful, order created.",
        orderId: orderDetails.orderId,
    });
});

module.exports = {
    createCheckoutSession,
    checkoutSuccess,
};