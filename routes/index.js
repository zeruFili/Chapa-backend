// index.js

const bankRoutes = require('./Bank_Route');
const paymentRoutes = require('./Payment_Route');
const transactionRoutes = require('./Transaction_Route');
const userRoutes = require('./User_Routes');


module.exports = {
    bankRoutes,
    paymentRoutes,
    transactionRoutes,
    userRoutes
};