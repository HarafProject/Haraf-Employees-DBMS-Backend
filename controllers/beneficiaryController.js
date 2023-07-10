const Beneficiary = require('../models/employee');
const StatusCodes = require('../utils/status-codes');


exports.getAllBeneficiary = async (req, res) => {
  try {
    const totalBeneficaries = await Beneficiary.find();
    res.status(StatusCodes.OK).json({
      status: "success",
      message: "Total list of beneficiary",
      data: totalBeneficaries,
    });
  } catch (error) {
    res.status(StatusCodes.SERVER_ERROR).json({
      status: "error",
      message: "Failed to retrieve the list of beneficiaries",
      error: error.message,
    });
  }
};