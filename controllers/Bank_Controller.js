const bankService = require("../services/bank.service");
const catchAsync = require("../utils/catchAsync");
const httpStatus = require("http-status");

const createBank = catchAsync(async (req, res) => {
  const { accountNumber, bankCode, amount, bankName } = req.body;
  const bank = await bankService.createBank(req.user._id, accountNumber, bankCode, amount, bankName);
  res.status(httpStatus.default.CREATED).json({
    success: true,
    message: "Bank record created successfully",
    bank,
  });
});

const updateBank = catchAsync(async (req, res) => {
  const { bankId } = req.body;
  const bank = await bankService.updateBank(req.user._id, bankId, req.body);
  res.status(httpStatus.default.OK).json({
    success: true,
    message: "Bank record updated successfully",
    bank,
  });
});

const deleteBank = catchAsync(async (req, res) => {
  const { bankId } = req.body;
  await bankService.deleteBank(req.user._id, bankId);
  res.status(httpStatus.default.OK).json({
    success: true,
    message: "Bank record deleted successfully",
  });
});

const getBanksByUserId = catchAsync(async (req, res) => {
  const banks = await bankService.getBanksByUserId(req.user._id);
  res.status(httpStatus.default.OK).json({
    success: true,
    message: "Bank records retrieved successfully",
    banks,
  });
});

module.exports = {
  createBank,
  updateBank,
  deleteBank,
  getBanksByUserId,
};