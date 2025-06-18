const joi = require('joi');

const bankSchema = {
  body: joi.object().keys({
    accountNumber: joi.string().required(),
    bankCode: joi.string().required(),
    amount: joi.number().required(),
    bankName: joi.string().required(),
  }),
};

const updateBankSchema = {
  body: joi.object().keys({
    bankId: joi.string().required(),
    accountNumber: joi.string(),
    bankCode: joi.string(),
    amount: joi.number(),
    bankName: joi.string(),
  }).min(1), // At least one field must be provided
};

module.exports = {
  bankSchema,
  updateBankSchema,
};