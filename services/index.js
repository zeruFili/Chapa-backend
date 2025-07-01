// index.js

const authService = require('./auth.service');
const cartService = require('./cart.service');
const paymentService = require('./payment.service');
const productService = require('./product.service');

module.exports = {
    authService,
    cartService,
    paymentService,
    productService
};