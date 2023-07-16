const StatusCodes = require("../utils/status-codes");
const WorkTypology = require("../models/workTypology");
const { Admin } = require("../models/admin");
const User = require("../models/user")
const Lga = require("../models/lga")
const Attendance = require("../models/attendance")
const AttendanceRecord = require("../models/attendanceRecord")
const bcrypt = require("bcrypt");
const generateUniqueId = require('generate-unique-id');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');
const SupervisorRequest = require("../models/supervisorRequest");
const SupervisorNotification = require("../models/notifySupervisor")
const { Supervisor_Notification } = require("../utils/sendMail")
const Beneficiary = require('../models/employee');



exports.work_typology = async (req, res) => {
  const { name } = req.body;

  await WorkTypology.findOneAndUpdate({ name }, {
    $set: {
      name
    }
  }, {
    upsert: true
  })

  return res.status(StatusCodes.OK).json({
    status: "success",
    message: "Work Typolgy Updated succesfully.",

  });

};

// Create Admin
exports.createAdmin = async (req, res) => {
  let admin = await Admin.findOne({ email: req.body.email });

  if (admin) return res.status(StatusCodes.BAD_REQUEST).json({ error: "User already exist. Please contact Super Admin" });

  // If admin does not exist, create
  if (!admin) {
    //generate order id
    let userID = generateUniqueId({
      length: 10,
      useLetters: false
    });
    //make sure the order id is unique
    let id_check = await Admin.findOne({ reference: userID }).exec();
    while (id_check !== null) {
      userID = generateUniqueId({
        length: 10,
        useLetters: false
      });

      id_check = await Admin.findOne({ reference: userID }).exec();
    }
    req.body.reference = userID
    admin = new Admin(req.body, ["firstname", "surname", "reference", "email", "phone", "zone", "lga", "password", "role", "operations"]);
    const salt = await bcrypt.genSalt(10);
    admin.password = await bcrypt.hash(admin.password, salt);
    admin = await admin.save();
  }

  // const token = user.generateAuthToken();
  res.status(StatusCodes.OK).json({
    status: "Success",
    message: "Account Created",
    // token,
  }

  );
};

//*************************Admin login******************
exports.login = async (req, res) => {
  let admin = await Admin.findOne({ email: req.body.email });
  if (!admin) return res.status(400).json({ error: 'Invalid Credentials.' });
  const validPassword = await bcrypt.compare(req.body.password, admin.password);
  if (!validPassword) return res.status(422).json({ error: 'Invalid credentials' });

  if (!admin.isVerified) return res.status(StatusCodes.UNAUTHORIZED).json({ error: 'Un-Authorized action. You have not been granted access yet. please contact Super admin.' });

  const token = admin.generateAuthToken();

  user = {
    _id: admin._id,
    reference: admin.reference,
    firstname: admin.firstname,
    surname: admin.surname,
    phone: admin.phone,
    email: admin.email,
    role: admin.role,
    zone: admin.zone,
    lga: admin.lga,
    operation: admin.operations,
  }

  res.status(StatusCodes.OK).json({
    status: "Success",
    message: "Login Successfull",
    token,
    user
  });

};

//**********************************Update admin **********************/
exports.updateadmin = asyncHandler(async (req, res, next) => {
  let admin = await Admin.findById(req.params.id);

  if (!admin) {
    return next(
      new ErrorResponse(`Admin not found with id of ${req.params.id}`, 404)
    );
  }

  admin = await Admin.findOneAndUpdate({ _id: req.params.id }, req.body, {
    new: true,
    runValidators: true
  });

  res.status(200).json({
    success: true,
    message: "Account Updated"
  });
});

exports.handleSupervisorRequest = async (req, res) => {
  const { action, type } = req.query
  const { reason } = req.body
  if (action === "declined" && !reason) return res.status(StatusCodes.UNPROCESSABLE_ENTITY).json({ error: "Please give a reason for declining request." });

  const request = await SupervisorRequest.findByIdAndUpdate(req.params.id,
    {
      $set: {
        status: action
      }
    }, { new: true })
    .populate("user")
    .exec()
  const notifySupervisor = new SupervisorNotification({
    supervisor: request.user,
    request: request,
    reason
  })
  await notifySupervisor.save()

  await Supervisor_Notification(request.user.email,
    request.user.firstname, type, action)

  res.status(StatusCodes.OK).json({
    status: "success",
    message: `Supervisor Request ${action} Successfully`,
  });
};

//*************************Admin login******************
exports.getDataSummary = async (req, res) => {
  if (req.user.role === "admin") {
    let { zone } = req.user
    const counts = await Promise.all([
      Beneficiary.countDocuments({ zone }).exec(),
      User.countDocuments({ zone }).exec(),
      Lga.countDocuments({ zone }).exec(),
      Attendance.countDocuments({ zone }).exec(),

    ]);

    const [beneficiaryCount, userCount, lgaCount, attendanceCount] = counts;
    res.status(StatusCodes.OK).json({
      status: "Success",
      data: {
        beneficiaryCount,
        userCount,
        lgaCount,
        attendanceCount
      }
    });
  } else {
    const counts = await Promise.all([
      Beneficiary.countDocuments().exec(),
      User.countDocuments().exec(),
      Lga.countDocuments().exec(),
      Attendance.countDocuments().exec(),
    ]);

    const [beneficiaryCount, userCount, lgaCount, attendanceCount] = counts;

    res.status(StatusCodes.OK).json({
      status: "Success",
      data: {
        beneficiaryCount,
        userCount,
        lgaCount,
        attendanceCount
      }
    });
  }


};

exports.getUniqueAttendanceDates = async (req, res) => {
  const dates = await Attendance.distinct('date').exec();
  res.status(StatusCodes.OK).json({
    status: "Success",
    dates
  });
}

exports.getUniqueAttendanceWeeks = async (req, res) => {
  const uniqueWeeks = await AttendanceRecord.aggregate([
    {
      $group: {
        _id: { $week: "$date" },
      },
    },
    {
      $group: {
        _id: null,
        weeks: { $push: "$_id" },
      },
    },
    {
      $project: {
        _id: 0,
        weeks: 1,
      },
    },
  ]);

  res.status(StatusCodes.OK).json({
    status: "Success",
    weeks: uniqueWeeks[0].weeks
  });
}

exports.getBeneficiaryAttendnanceAnalytics = async (req, res) => {
  const { type, value } = req.query

  let data;
  if (type === "daily") {
    console.log(value)
    if (req.user.role === "admin") {

      data = await AttendanceRecord.find({ zone: req.user.zone, date: new Date(value) })
        .select("status lga zone workTypology")
        .populate("lga")
        .exec()
    } else {
      data = await AttendanceRecord.find({ date: new Date(value) })
        .select("status lga zone workTypology")
        .populate("lga")
        .exec()
        .exec()
    }

  } else if (type === "weekly") {
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

    if (req.user.role === "admin") {
      data = await AttendanceRecord.find({
        zone: req.user.zone,
        date: { $gte: firstDayOfWeek, $lte: lastDayOfWeek }
      })
        .select("status lga zone workTypology")
        .populate("lga")
        .exec();
    } else {
      data = await AttendanceRecord.find({
        date: { $gte: firstDayOfWeek, $lte: lastDayOfWeek }
      })
        .select("status lga zone workTypology")
        .populate("lga")
        .exec();
    }

  } else if (type === "monthly") {
    year = new Date().getFullYear()
    const fromDate = new Date(`${year}-${value}-${1}`);
    const toDate = new Date(fromDate.getFullYear(), fromDate.getMonth() + 1, 0);
    if (req.user.role === "admin") {
      data = await AttendanceRecord.find({
        date: { '$gte': fromDate, '$lte': toDate },
        zone: req.user.zone
      })
        .select("status lga zone workTypology")
        .populate("lga")
        .exec();
    } else {
      data = await AttendanceRecord.find({
        date: { '$gte': fromDate, '$lte': toDate }
      })
        .select("status lga zone workTypology")
        .populate("lga")
        .exec();
    }

  }
  // console.log(data)
  res.status(StatusCodes.OK).json({
    status: "Success",
    data
  });

};

