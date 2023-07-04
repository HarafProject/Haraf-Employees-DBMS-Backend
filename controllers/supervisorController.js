const { bankList, verifyAccount } = require("../utils/paystack");
const StatusCodes = require("../utils/status-codes");
const WorkTypology = require("../models/workTypology");

exports.bank_details = async (req, res) => {
    const { accountNumber, bankCode, bankName } = req.body;

    // Verify bank account number
    const result = await verifyAccount(accountNumber, bankCode);

    // Invalid account number
    if (!result.status) {
        return res.status(StatusCodes.UNPROCESSABLE_ENTITY).json({
            status: "failed",
            error: result.message,
        });
    }

    const bankDetails = {
        accountNumber,
        bankCode,
        accountName: result.data.account_name,
        bankName,

    };

    return res.status(StatusCodes.OK).json({
        status: "success",
        message: "Bank details verified successfully.",
        bankDetails
    });
};

exports.bank_list = async (req, res) => {

    const { data } = await bankList();
    return res.status(StatusCodes.OK).json({
        status: "success",
        banks: data

    });
}

exports.work_typology = async (req, res) => {
    const workTypology = await WorkTypology.find().exec()

    res.status(StatusCodes.OK).json({
        status:"success",
        workTypology
    });
}
exports.new_employee_request = async (req, res) => {
    const {reason} = req.body

    res.status(StatusCodes.OK).json({
        status:"success",
   
    });
}
