const Beneficiary = require('../models/employee');
const AttendanceRecord = require("../models/attendanceRecord")
const StatusCodes = require('../utils/status-codes');


exports.getAllBeneficiary = async (req, res) => {

  let totalBeneficaries;
  if (req.user.role === "admin") {
    totalBeneficaries = await Beneficiary.find({ zone: req.user.zone })
      .sort({ createdAt: -1 })
      .populate("ward")
      .populate("lga")
      .populate("zone")
      .populate("workTypology")
      .exec()
  } else {
    totalBeneficaries = await Beneficiary.find()
      .sort({ createdAt: -1 })
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
  const { type, value } = req.query
  console.log(value === "")
  if (type === "weekly" && value !== "") {
    const weekNumber = Number(value);
    const year = new Date().getFullYear();

    // Create a new date object for January 1st of the current year
    const januaryFirst = new Date(year, 0, 1);

    // Get the day of the week for January 1st (0 - Sunday, 1 - Monday, ..., 6 - Saturday)
    const januaryFirstDayOfWeek = januaryFirst.getDay();

    // Calculate the number of days to add to get to the first day of the desired week
    const daysToAdd = (weekNumber - 1) * 7 - januaryFirstDayOfWeek;

    // Create the date object for the first day of the desired week
    const firstDayOfWeek = new Date(year, 0, 1 + daysToAdd);
    // Create the date object for the last day of the desired week
    const lastDayOfWeek = new Date(firstDayOfWeek);
    lastDayOfWeek.setDate(lastDayOfWeek.getDate() + 6);

    const counts = await Promise.all([
      AttendanceRecord.countDocuments({
        employee: req.params.id,
        date: { $gte: firstDayOfWeek, $lte: lastDayOfWeek }
      }).exec(),
      AttendanceRecord.countDocuments({
        employee: req.params.id,
        date: { $gte: firstDayOfWeek, $lte: lastDayOfWeek },
        status: "Present"
      }).exec(),
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
  } else if (type === "monthly" && value !== "") {
    year = new Date().getFullYear()
    const fromDate = new Date(`${year}-${value}-${1}`);
    const toDate = new Date(fromDate.getFullYear(), fromDate.getMonth() + 1, 0);
    const counts = await Promise.all([
      AttendanceRecord.countDocuments({
        employee: req.params.id,
        date: { '$gte': fromDate, '$lte': toDate }
      }).exec(),
      AttendanceRecord.countDocuments({
        employee: req.params.id,
        status: "Present",
        date: { '$gte': fromDate, '$lte': toDate }
      }).exec(),
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
  } else {
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

}