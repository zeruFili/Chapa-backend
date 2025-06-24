const joi = require('joi');

const paymentSchema = {
    body: joi.object().keys({
        amount: joi.number().positive().required(),
    }),
};

const txRefSchema = {
    params: joi.object().keys({
        tx_ref: joi.string().required(),
    }),
}; 

const transferSchema = {
    body: joi.object().keys({
        amount: joi.number().greater(0).required(), // Amount must be a positive number
        bankCode: joi.string().required(), // Bank code must be provided
    }),
};

module.exports = {
    paymentSchema,
    txRefSchema,
    transferSchema
};