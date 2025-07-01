const {cartService} = require("../services");
const catchAsync = require("../utils/catchAsync.js");
const httpStatus = require("http-status");

const getCartProducts = catchAsync(async (req, res) => {
    const cartProducts = await cartService.getCartProducts(req.user._id);
    res.json(cartProducts);
});

const addToCart = catchAsync(async (req, res) => {
    const cartItems = await cartService.addToCart(req.user._id, req.body.productId);
    res.json(cartItems);
});

const removeAllFromCart = catchAsync(async (req, res) => {
    const cartItems = await cartService.removeAllFromCart(req.user._id, req.body.productId);
    res.json(cartItems);
});

const updateQuantity = catchAsync(async (req, res) => {
    const cartItems = await cartService.updateQuantity(req.user._id, req.params.id, req.body.quantity);
    res.json(cartItems);
});

module.exports = {
    getCartProducts,
    addToCart,
    removeAllFromCart,
    updateQuantity,
};