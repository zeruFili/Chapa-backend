const joi = require('joi');

const createTransactionSchema = {
    body: joi.object().keys({
        amount: joi.number().greater(0).required(), // Amount must be a positive number
        receiver: joi.string().required(), // Receiver must be provided
        description: joi.string().optional(), // Description is optional
        account_name: joi.string().required(), // Account name must be provided
        account_number: joi.string().required(), // Account number must be provided
        currency: joi.string().valid('ETB').required(), // Currency must be 'ETB'
        bank_code: joi.string().required(), // Bank code must be provided
    }),
};

const updateTransactionStatusSchema = {
    params: joi.object().keys({
        transactionId: joi.string().required(), // Transaction ID must be provided
    }),
    body: joi.object().keys({
        status: joi.string().valid('rejected', 'accepted', 'pending').required(), // Status must be one of the allowed values
    }),
};

module.exports = {
    createTransactionSchema,
    updateTransactionStatusSchema,
};