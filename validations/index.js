
const authValidation = require('./auth.validation');
const cartValidation = require('./cart.validation');
const envValidation = require('./env.validation');
const paymentValidation = require('./payment.validation');
const productValidation = require('./product.validation');

module.exports = {
    authValidation,
    cartValidation,
    envValidation,
    paymentValidation,
    productValidation
};