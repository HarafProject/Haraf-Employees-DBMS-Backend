const StatusCodes = require("../utils/status-codes");
const mongoose = require("mongoose");
// const { SuperAdmin } = require("../models/superadmin");
const Users = require("../models/user");
const Zone = require("../models/zone");
const Employee = require("../models/employee");
const SupervisorRequest = require("../models/supervisorRequest");
const Attendance = require("../models/attendanceRecord");
const AllAttendance = require("../models/attendance");
const Ward = require("../models/ward");

const bcrypt = require("bcrypt");
const { search } = require("../routes/superadmin");
const { Admin } = require("../models/admin");
const User = require("../models/user");
// Create SuperAdmin
// exports.createSuperAdmin = async (req, res) => {
//   let superadmin = await SuperAdmin.findOne({ email: req.body.email });

//   if (superadmin)
//     return res
//       .status(StatusCodes.BAD_REQUEST)
//       .json({ error: "User already exist" });
//   // If user does not exist, create
//   if (!superadmin) {
//     superadmin = new SuperAdmin(req.body, [
//       "firstname",
//       "surname",
//       "email",
//       "phone",
//       "zone",
//       "lga",
//       "password",
//       "role",
//       "operations",
//     ]);
//     const salt = await bcrypt.genSalt(10);
//     superadmin.password = await bcrypt.hash(superadmin.password, salt);
//     superadmin = await superadmin.save();
//   }

//   // const token = user.generateAuthToken();
//   res.status(StatusCodes.OK).json({
//     status: "Success",
//     message: "Account Created",
//     // token,
//   });
// };

// //*************************Super Admin login******************
// exports.login = async (req, res) => {
//   let superadmin = await SuperAdmin.findOne({ email: req.body.email });
//   if (!superadmin)
//     return res.status(400).json({ error: "Invalid Credentials." });
//   const validPassword = await bcrypt.compare(
//     req.body.password,
//     superadmin.password
//   );
//   if (!validPassword)
//     return res.status(422).json({ error: "Invalid credentials" });

//   if (!superadmin.isVerified)
//     return res
//       .status(StatusCodes.UNAUTHORIZED)
//       .json({ error: "Un-Authorized action." });

//   const token = superadmin.generateAuthToken();

//   res.status(StatusCodes.OK).json({
//     status: "Success",
//     message: "Login Successfull",
//     token,
//   });
// };

//*************************Get all Supervisors******************
exports.getAllSupervisors = async (req, res) => {
  try {
    const data = await Users.find({ role: "supervisor" }, { password: 0 });

    res.status(StatusCodes.OK).json({
      success: true,
      message: "List of all supervisors",
      data,
    });
  } catch (error) {
    res.status(StatusCodes.SERVER_ERROR).json({
      status: "error",
      message: "Failed to retrieve the list of beneficiaries",
      error: error.message,
    });
  }
};

exports.getAllWards = async (req, res) => {
  try {
    const data = await Ward.find().select("name");
    if (!data) {
      res.status(404).json({
        status: "error",
        message: "No ward found",
      });
    }

    res.status(StatusCodes.SERVER_ERROR).json({
      status: "success",
      message: "List of all wards",
      data,
    });
  } catch (error) {
    res.status(StatusCodes.SERVER_ERROR).json({
      status: "error",
      message: "Failed to retrieve the list of wards",
      error: error.message,
    });
  }
};

exports.getLGASupervisors = async (req, res) => {
  try {
    const data = await User.find({ role: "supervisor" });
    res.status(StatusCodes.OK).json({
      success: true,
      message: "List of all LGA supervisors",
      data,
    });
  } catch (error) {
    res.status(StatusCodes.SERVER_ERROR).json({
      status: "error",
      message: "Failed to retrieve the list of beneficiaries",
      error: error.message,
    });
  }
};

exports.filterByTopology = async (req, res) => {
  const targetTopology = req.body.topology;
  const topologyId = mongoose.Types.ObjectId(targetTopology);

  if (!targetTopology) {
    return res.status(400).json({ error: "Missing Topology parameter" });
  }
  const data = await Employee.find({ workTypology: topologyId });

  res.status(StatusCodes.OK).json({
    success: true,
    message: "Filter by work topology",
    data,
  });
};



//attendance 
exports.allZonesAttendanceReport = async (req, res) => {

  let attendance;
  if (req.user.role === "admin") {
    attendance = await AllAttendance.find({ zone: req.user.zone })
      .sort({ date: -1 })
      .populate("submittedBy", { password: 0 })
      .populate("zone")
      .populate("lga")
      .populate({
        path: 'attendanceRecord',
        populate: [
          { path: 'supervisor', select: '-password' },
          'employee',
          'zone',
          'lga',
          'ward',
          'workTypology'
        ]
      })
      .exec();
  } else {
    attendance = await AllAttendance.find()
      .sort({ date: -1 })
      .populate("submittedBy", { password: 0 })
      .populate("zone")
      .populate("lga")
      .populate({
        path: 'attendanceRecord',
        populate: [
          { path: 'supervisor', select: '-password' },
          'employee',
          'zone',
          'lga',
          'ward',
          'workTypology'
        ]
      })
      .exec();
  }

  // console.log("attendance", attendance);

  res.status(StatusCodes.OK).json({
    success: true,
    message: "All zones attendance",
    data: attendance,
  });

};

exports.zoneReport = async (req, res) => {
  try {
    const report = req.body.zone;

    const reportId = mongoose.Types.ObjectId(report);

    if (!report) {
      return res.status(400).json({ error: "Missing report parameter" });
    }
    const data = await AllAttendance.find({ zone: reportId });

    res.status(StatusCodes.OK).json({
      success: true,
      message: "Filter reports by zone",
      data,
    });
  } catch (error) {
    res.status(StatusCodes.SERVER_ERROR).json({
      status: "error",
      message: "Failed to retrieve  attendance report",
      error: error.message,
    });
  }
};

exports.filterReportsByLGA = async (req, res) => {
  try {
    const report = req.body.lga;

    const reportId = mongoose.Types.ObjectId(report);

    if (!report) {
      return res.status(400).json({ error: "Missing report parameter" });
    }
    const data = await AllAttendance.find({ lga: reportId });

    res.status(StatusCodes.OK).json({
      success: true,
      message: "Filter reports by zone",
      data,
    });
  } catch (error) {
    res.status(StatusCodes.SERVER_ERROR).json({
      status: "error",
      message: "Failed to retrieve  attendance report",
      error: error.message,
    });
  }
};

exports.filterAttendanceByDate = async (req, res) => {
  const { date } = req.body;
  reportId = date;
  const data = await AllAttendance.find({ date: reportId });

  if (!date) {
    return res.status(400).json({ error: "Missing  date parameters" });
  }

  try {
    const data = await AllAttendance.find({
      date: date,
    });

    res.status(200).json({
      success: true,
      message: "Filtered beneficiaries by date",
      beneficiaries: data,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: "Internal Server Error",
    });
  }
};
exports.searchAttendanceReport = async (req, res) => {
  const searchQuery = req.body.searchParams;

  //   if (!searchQuery) {
  //     return res.status(400).json({ error: "Missing search query parameter" });
  //   }

  try {
    const data = await Users.find({ role: "supervisor" })
      .select("-password")
      .exec();

    const searchResults = data.filter((supervisor) => {
      const supervisorFullName =
        supervisor.firstname + " " + supervisor.surname;
      const query = searchQuery.toLowerCase();
      return supervisorFullName.toLowerCase().includes(query);
    });

    res.status(200).json({
      success: true,
      message: "Search result",
      supervisors: searchResults,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};


//Attendance analytics

exports.filterByLGA = async (req, res) => {
  const targetLGA = req.body.lga;
  const LgaId = mongoose.Types.ObjectId(targetLGA);

  if (!targetLGA) {
    return res.status(400).json({ error: "Missing LGA parameter" });
  }
  const data = await Employee.find({ lga: LgaId });

  res.status(StatusCodes.OK).json({
    success: true,
    message: "Filter by LGA",
    data,
  });
};

exports.filterByZones = async (req, res) => {
  const targetZone = req.body.zone;
  const zoneId = mongoose.Types.ObjectId(targetZone);

  if (!targetZone) {
    return res.status(400).json({ error: "Missing Zone parameter" });
  }

  const data = await Employee.find({ zone: zoneId });

  res.status(StatusCodes.OK).json({
    success: true,
    message: "Filtered  by Zone",
    data,
  });
};

exports.filterByWards = async (req, res) => {
  const targetward = req.body.ward;

  const wardId = mongoose.Types.ObjectId(targetward);

  if (!targetward) {
    return res.status(400).json({ error: "Missing ward parameter" });
  }

  const data = await Employee.find({ ward: wardId });

  res.status(StatusCodes.OK).json({
    success: true,
    message: "Filtered  by ward",
    data,
  });
};

exports.searchBeneficiaries = async (req, res) => {
  const searchQuery = req.body.searchParams;

  if (!searchQuery) {
    return res.status(400).json({ error: "Missing search query parameter" });
  }

  try {
    const data = await Employee.find();

    const searchResults = data.filter((beneficiary) => {
      const beneficiaryName = beneficiary.fullName.toLowerCase();
      const query = searchQuery.toLowerCase();
      return beneficiaryName.includes(query);
    });

    res.status(200).json({
      success: true,
      message: "Search result",
      beneficiaries: searchResults,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: "Internal Server Error",
    });
  }
};

exports.editEmployeeRequest = async (req, res) => {
  let pendingRequests;
  if (req.user.role === "admin") {

    // Fetch pending requests where the user's zone is equal to the admin's zone
    pendingRequests = await SupervisorRequest.find({
      status: 'pending',
      type: "edit-employee",
    })
      .populate({
        path: "employee",
        populate: [
          { path: "lga", model: "LGA" }, // Populate 'lga' field referencing 'LGA' model
          { path: "ward", model: "Ward" }, // Populate 'ward' field referencing 'Ward' model
        ],
      })
      .populate({
        path: 'user',
        select: "-password",
        match: { zone: req.user.zone } // Filtering based on the admin's zone ID
      })
      .exec();

  } else {
    // Fetch pending requests where the user's zone is equal to the admin's zone
    pendingRequests = await SupervisorRequest.find({
      status: 'pending',
      type: "edit-employee",
    })
      .populate({
        path: "employee",
        populate: [
          { path: "lga", model: "LGA" }, // Populate 'lga' field referencing 'LGA' model
          { path: "ward", model: "Ward" }, // Populate 'ward' field referencing 'Ward' model
        ],
      })
      .populate({
        path: 'user',
      })
      .exec();

  }

  res.status(StatusCodes.OK).json({
    success: true,
    message: "Beneficiary edit Request",
    data: pendingRequests,
  });

};

exports.addEmployeeRequest = async (req, res) => {

  let pendingRequests;
  if (req.user.role === "admin") {

    // Fetch pending requests where the user's zone is equal to the admin's zone
    pendingRequests = await SupervisorRequest.find({
      status: 'pending',
      type: "add-employee",
    })
      .populate({
        path: "employee",
        populate: [
          { path: "lga", model: "LGA" }, // Populate 'lga' field referencing 'LGA' model
          { path: "ward", model: "Ward" }, // Populate 'ward' field referencing 'Ward' model
        ],
      })
      .populate({
        path: 'user',
        select: "-password",
        match: { zone: req.user.zone } // Filtering based on the admin's zone ID
      })
      .exec();

  } else {
    // Fetch pending requests where the user's zone is equal to the admin's zone
    pendingRequests = await SupervisorRequest.find({
      status: 'pending',
      type: "add-employee",
    })
      .populate({
        path: "employee",
        populate: [
          { path: "lga", model: "LGA" }, // Populate 'lga' field referencing 'LGA' model
          { path: "ward", model: "Ward" }, // Populate 'ward' field referencing 'Ward' model
        ],
      })
      .populate({
        path: 'user',
      })
      .exec();
  };
  res.status(StatusCodes.OK).json({
    success: true,
    message: "Beneficiary add Request",
    data: pendingRequests,
  });
}
exports.viewEmployeeRequest = async (req, res) => {
  try {
    const requestId = req.params.id;

    const data = await SupervisorRequest.findById(requestId);

    if (!data) {
      return res.status(404).json({ message: "Record not found!" });
    } else {
      res.status(200).json({
        success: true,
        data,
      });
    }
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "An error occured",
      error: err.message,
    });
  }
};

exports.viewAllEmployeeRequest = async (req, res) => {
  try {
    const data = await SupervisorRequest.find();

    if (!data) {
      return res.status(404).json({ message: "Record not found!" });
    } else {
      res.status(200).json({
        success: true,
        data,
      });
    }
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "An error occured",
      error: err.message,
    });
  }
};

exports.deleteEmployeeRequest = async (req, res) => {
  let pendingRequests;
  if (req.user.role === "admin") {

    // Fetch pending requests where the user's zone is equal to the admin's zone
    pendingRequests = await SupervisorRequest.find({
      status: 'pending',
      type: "delete-employee",
    })
      .populate({
        path: "employee",
        populate: [
          { path: "lga", model: "LGA" }, // Populate 'lga' field referencing 'LGA' model
          { path: "ward", model: "Ward" }, // Populate 'ward' field referencing 'Ward' model
        ],
      })
      .populate({
        path: 'user',
        select: "-password",
        match: { zone: req.user.zone } // Filtering based on the admin's zone ID
      })
      .exec();

  } else {
    // Fetch pending requests where the user's zone is equal to the admin's zone
    pendingRequests = await SupervisorRequest.find({
      status: 'pending',
      type: "delete-employee",
    })
      .populate({
        path: "employee",
        populate: [
          { path: "lga", model: "LGA" }, // Populate 'lga' field referencing 'LGA' model
          { path: "ward", model: "Ward" }, // Populate 'ward' field referencing 'Ward' model
        ],
      })
      .populate({
        path: 'user',
      })
      .exec();

  }

  res.status(StatusCodes.OK).json({
    success: true,
    message: "Beneficiary delete Request",
    data: pendingRequests,
  });

};

exports.approveEmployeeRequest = async (req, res) => {
  const requestId = req.body.id;
  const userToBeApproved = await SupervisorRequest.findById(requestId);

  if (!userToBeApproved) {
    return res.status(StatusCodes.NOT_FOUND).json({
      success: false,
      message: "Supervisor reqeust not found",
    });
  }

  // Perform any necessary checks before deleting the user
  if (userToBeApproved.status === "approved") {
    return res.status(StatusCodes.BAD_REQUEST).json({
      success: false,
      message: "Request has already been processed",
    });
  }

  userToBeApproved.status = "approved";
  await userToBeApproved.save();


  res.status(StatusCodes.OK).json({
    success: true,
    message: "Reqeust approved   successfully",
    user: userToBeApproved,
  });

};

exports.declineEmployeeRequest = async (req, res) => {
  const { id } = req.body;

  //  const requestId = req.req.id;

  try {
    const request = await SupervisorRequest.findById(id);

    if (!request) {
      return res.status(StatusCodes.NOT_FOUND).json({
        success: false,
        message: "Request not found",
      });
    }

    if (request.status === "declined") {
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: "Request has already been processed",
      });
    }

    request.status = "declined";
    // request.reason = reason;
    await request.save();

    res.status(StatusCodes.OK).json({
      success: true,
      message: "Request has been declined successfully",
      data: request,
    });
  } catch (error) {
    res.status(StatusCodes.SERVER_ERROR).json({
      success: false,
      message: "Failed to process the request",
      error: error.message,
    });
  }
};

exports.getBneneficiaryProfile = async (req, res) => {
  const requestId = req.params.id;
  try {
    if (!requestId) {
      return res.status(StatusCodes.NOT_FOUND).json({
        success: false,
        message: "Request not found",
      });
    }

    const request = await SupervisorRequest.findById(requestId);

    res.status(StatusCodes.OK).json({
      success: true,
      message: "Beneficiary profile",
      data: request,
    });
  } catch (error) {
    res.status(StatusCodes.SERVER_ERROR).json({
      success: false,
      message: "Failed to fetch beneficiary",
      error: error.message,
    });
  }
};

exports.redoEmployeeAction = async (req, res) => { };

exports.fetchBeneficiaryAttendance = async (req, res) => {
  const beneficiaryId = req.params.id;

  try {
    const attendance = await Attendance.find({ beneficiaryId });

    if (attendance.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No attendance records found for the beneficiary",
      });
    }

    res.status(200).json({
      success: true,
      message: "Beneficiary attendance fetched successfully",
      data: attendance,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch beneficiary attendance",
      error: error.message,
    });
  }
};

exports.fetchBeneficiaryPresentAttendance = async (req, res) => {
  const beneficiaryId = req.params.id;

  try {
    const attendance = await Attendance.find({
      beneficiaryId,
      "attempt.status": "Present",
    });

    if (attendance.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No attendance records found for the beneficiary",
      });
    }

    res.status(200).json({
      success: true,
      message: "Beneficiary attendance fetched successfully",
      data: attendance,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch beneficiary attendance",
      error: error.message,
    });
  }
};

exports.fetchBeneficiaryAbsentAttendance = async (req, res) => {
  const beneficiaryId = req.params.id;

  try {
    const attendance = await Attendance.find({
      beneficiaryId,
      "attempt.status": "Absent",
    });

    if (attendance.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No attendance records found for the beneficiary absent days",
      });
    }

    res.status(200).json({
      success: true,
      message: "Beneficiary attendance fetched successfully",
      data: attendance,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch beneficiary attendance",
      error: error.message,
    });
  }
};

exports.fetchAttendanceDetails = async (req, res) => {
  try {
    const attendanceDetails = await AllAttendance.find();

    if (attendanceDetails.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No attendance records found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Attendance details fetched successfully",
      data: attendanceDetails,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch attendance details",
      error: error.message,
    });
  }
};


//Manage supervisors
exports.getSupervisorsAndAdmin = async (req, res) => {
  if (req.user.role === "admin") {
    const data = await Users.find({ zone: req.user.zone }, { password: 0 })
      .populate("zone")
      .populate("lga")
      .exec();
    res.status(200).json({
      success: true,
      message: "Successful",
      data: data,
    });
  } else {
    const data = await Users.find({}, { password: 0 })
      .populate("zone")
      .populate("lga")
      .exec();

    res.status(200).json({
      success: true,
      message: "Successful",
      data,
    });
  }

};

//Manage supervisors
exports.getAdmins = async (req, res) => {

  const data = await Admin.find({}, { password: 0 })
    .populate("zone")
    .populate("lga")
    .exec();

  res.status(200).json({
    success: true,
    message: "Successful",
    data,
  });

};

exports.searchSupervisor = async (req, res) => {
  const searchQuery = req.body.searchParams;

  if (!searchQuery) {
    return res.status(400).json({ error: "Missing search query parameter" });
  }

  try {
    const data = await Users.find({ role: "supervisor" })
      .select("-password")
      .exec();

    const searchResults = data.filter((supervisor) => {
      const supervisorFullName =
        supervisor.firstname + " " + supervisor.surname;
      const query = searchQuery.toLowerCase();
      return supervisorFullName.toLowerCase().includes(query);
    });

    res.status(200).json({
      success: true,
      message: "Search result",
      supervisors: searchResults,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};


exports.filterSupervisorByZone = async (req, res) => {
  const searchParam = req.params.id;

  try {
    if (!searchParam) {
      return res.status(400).json({ error: "Missing Zone parameter" });
    }

    const filteredData = await Users.find({
      zone: searchParam,
      role: "supervisor",
    })
      .select("-password")
      .exec();

    res.status(200).json({
      success: true,
      message: "Successful",
      filteredData,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "An error occurred while fetching supervisors by zone",
      error: error.message,
    });
  }
};

exports.filterSupervisorByLGA = async (req, res) => {
  const searchParam = req.params.id;

  try {
    if (!searchParam) {
      return res.status(400).json({ error: "Missing Zone parameter" });
    }

    const filteredData = await Users.find({
      lga: searchParam,
      role: "supervisor",
    })
      .select("-password")
      .exec();

    res.status(200).json({
      success: true,
      message: "Successful",
      filteredData,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "An error occurred while fetching supervisors by zone",
      error: error.message,
    });
  }
};

//Check this delete agagin
exports.deleteSupervisor = async (req, res) => {
  try {
    const data = req.params.id;
    if (!data) {
      return res.status(404).json("ID parameter not found");
    }

    data.findByIdAndRemove(data);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "An error occured trying delete a Supervisors",
      err: error.message,
    });
  }
};

exports.verifySupervisor = async (req, res) => {

  const supervisorId = req.params.id;

  if (!supervisorId) {
    return res.status(404).json({ error: "ID parameter not found" });
  }

  const supervisor = await Users.findOne({ _id: supervisorId })
    .populate("lga")
    .populate("zone")
    .exec();

  if (!supervisor) {
    return res
      .status(404)
      .json({ error: "Supervisor with the given id is not found" });
  }

  supervisor.isVerified = true;
  await supervisor.save();


  return res.status(200).json({
    success: true,
    message: "Supervisor verified successfully",
    data: supervisor,
  });

};

exports.verifyAdmin = async (req, res) => {

  const adminId = req.params.id;

  if (!adminId) {
    return res.status(404).json({ error: "ID parameter not found" });
  }

  const admin = await Admin.findOne({ _id: adminId })
    .populate("lga")
    .populate("zone")
    .exec();

  if (!admin) {
    return res
      .status(404)
      .json({ error: "Admin with the given id is not found" });
  }

  admin.isVerified = true;
  await admin.save();


  return res.status(200).json({
    success: true,
    message: "Admin verified successfully",
    data: admin,
  });

};

exports.undoVerification = async (req, res) => {
  const userId = req.params.id;

  const user = await Users.findOne({ _id: userId })
    .populate("lga")
    .populate("zone")
    .exec();;

  if (!user) {
    return res.status(404).json({
      success: false,
      message: "User not found",
    });
  }

  user.isVerified = false;
  await user.save();

  res.status(200).json({
    success: true,
    message: "Verification undone successfully",
    data: user,
  });

};

exports.undoAdminVerification = async (req, res) => {
  const userId = req.params.id;

  const user = await Admin.findOne({ _id: userId })
    .populate("lga")
    .populate("zone")
    .exec();;

  if (!user) {
    return res.status(404).json({
      success: false,
      message: "User not found",
    });
  }

  user.isVerified = false;
  await user.save();

  res.status(200).json({
    success: true,
    message: "Verification undone successfully",
    data: user,
  });

};

exports.getASupervisor = async (req, res) => {
  try {
    const supervisorId = req.params.id;

    if (!supervisorId) {
      return res.status(404).json({ error: "ID parameter not found" });
    }

    const supervisor = await Users.findOne({ _id: supervisorId });

    if (!supervisor) {
      return res
        .status(404)
        .json({ error: "Supervisor with the given id is not found" });
    }

    return res.status(200).json({
      success: true,
      message: "Supervisor verified successfully",
      data: supervisor,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "An error occurred while verifying a Supervisor",
      error: error.message,
    });
  }
};




exports.supervisorSignInRequest = async (req, res) => {
  try {
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "An error occured trying delete a Supervisors",
      err: error.message,
    });
  }
};





//SuperAdmin profile
exports.fetchSuperAdminProfile = async (req, res) => {
  try {
    const user = req.user;

    return console.log(user);
    res.status(200).json({
      success: true,
      message: "Superadmin profile data fetched successfully",
      data: user,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "An error occured trying to fetch Admins and Supervisors",
      err: error.message,
    });
  }
};

exports.editAdminProfile = async (req, res) => {
  const { firstname, surname, phone } = req.body;

  const user = await Admin.findByIdAndUpdate(req.user._id, {
    firstname,
    surname,
    phone
  }, { new: true })
    .select("firstname email phone surname email role zone lga operations")
    .exec()

  res.status(StatusCodes.OK).json({
    status: "success",
    message: "Profile updated succesfully",
    user
  });
};

