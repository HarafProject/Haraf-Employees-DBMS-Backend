const Beneficiary = require('../models/employee');
const AttendanceRecord = require("../models/attendanceRecord")
const StatusCodes = require('../utils/status-codes');


exports.getAllBeneficiary = async (req, res) => {

  let totalBeneficaries;
  if (req.user.role === "admin") {
    totalBeneficaries = await Beneficiary.find({ zone: req.user.zone })
      .populate("ward")
      .populate("lga")
      .populate("zone")
      .populate("workTypology")
      .exec()
  } else {
    totalBeneficaries = await Beneficiary.find()
      .populate("ward")
      .populate("lga")
      .populate("zone")
      .populate("workTypology")
      .exec();
  }

  res.status(StatusCodes.OK).json({
    status: "success",
    message: "Total list of beneficiary",
    data: totalBeneficaries,
  });

};

exports.getBeneficiaryAttendnanceSummary = async (req, res) => {
  const counts = await Promise.all([
    AttendanceRecord.countDocuments({ employee: req.params.id }).exec(),
    AttendanceRecord.countDocuments({ employee: req.params.id, status: "Present" }).exec(),
  ]);

  const [attendanceCount, presentCount] = counts;
  res.status(StatusCodes.OK).json({
    status: "success",
    message: "Total list of beneficiary",
    data: {
      total: attendanceCount,
      present: presentCount,
      absent: (attendanceCount - presentCount)
    },
  });
}