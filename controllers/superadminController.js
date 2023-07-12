const StatusCodes = require("../utils/status-codes");
const mongoose  = require('mongoose');
const { SuperAdmin } = require("../models/superadmin");
const Users = require("../models/user");
const Zone = require('../models/zone');
const Employee = require('../models/employee');
const SupervisorRequest = require('../models/supervisorRequest');
const Attendance = require('../models/attendanceRecord'); 
const AllAttendance = require("../models/attendance");


const bcrypt = require("bcrypt");
const { search } = require("../routes/superadmin");
  // Create SuperAdmin
  exports.createSuperAdmin = async (req, res) => {
    let superadmin = await SuperAdmin.findOne({ email: req.body.email });
  
    if (superadmin) return res.status(StatusCodes.BAD_REQUEST).json({ error: "User already exist" });
    // If user does not exist, create
    if (!superadmin) {
      superadmin = new SuperAdmin(req.body, ["firstname", "surname", "email", "phone", "zone", "lga", "password", "role", "operations"]);
      const salt = await bcrypt.genSalt(10);
      superadmin.password = await bcrypt.hash(superadmin.password, salt);
      superadmin = await superadmin.save();
    }
  
    // const token = user.generateAuthToken();
    res.status(StatusCodes.OK).json({
      status: "Success",
      message: "Account Created",
      // token,
    }
  
    );
  };

  //*************************Super Admin login******************
exports.login = async (req, res) => {
    let superadmin = await SuperAdmin.findOne({ email: req.body.email });
    if (!superadmin) return res.status(400).json({ error: 'Invalid Credentials.' });
    const validPassword = await bcrypt.compare(req.body.password, superadmin.password);
    if (!validPassword) return res.status(422).json({ error: 'Invalid credentials' });
  
    if (!superadmin.isVerified) return res.status(StatusCodes.UNAUTHORIZED).json({ error: 'Un-Authorized action.' });
  
    const token = superadmin.generateAuthToken();
  
    res.status(StatusCodes.OK).json({
      status: "Success",
      message: "Login Successfull",
      token,
    });
  
  }


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

//    exports.filterByZones(req, res) {
//   const filteredZone = Zone.filter( zone =>)
//    users.filter(user => user.age >= age);
//   res.json(filteredUsers);
// }


exports.filterByLGA = async (req, res) => {
  const targetLGA = req.body.lga; 
   const LgaId = mongoose.Types.ObjectId(targetLGA);


  if (!targetLGA) {
    return res.status(400).json({ error: 'Missing LGA parameter' });
  }
const data = await Employee.find({ lga: LgaId });



  res.status(StatusCodes.OK).json({
    success: true,
    message: "Filter by LGA",
    data,
  });
};





exports.filterByZones = async(req, res) => {
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

exports.filterByWards = async(req, res) => {
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


exports.searchBeneficiaries = async(req, res) => {
  const searchQuery = req.body.searchParams; 


  if (!searchQuery) {
    return res.status(400).json({ error: "Missing search query parameter" });
  }

   const data = await Employee.find();

  const searchResults = data.filter((beneficiary) => {
    const beneficiaryName = beneficiary.fullName;

    const query = this.searchQuery;
    return beneficiaryName.includes(query);
  });


  res.status(StatusCodes.OK).json({
    success: true,
    message: "search result",
    beneficiaries: searchResults,
  });
};



exports.editEmployeeRequest = async (req, res) => {
  try {
    const data = SupervisorRequest.find({ type: "edit-employee" }).exec();;
    res.status(StatusCodes.OK).json({
      success: true,
      message: "Edit  Beneficary Request",
      data,
    });
  } catch (error) {
    res.status(StatusCodes.SERVER_ERROR).json({
      status: "error",
      error: error.message,
    });
  }
};

exports.addEmployeeRequest = async (req, res) => {
  try {
    const data = SupervisorRequest.find({ type: "new-employee" }).exec();
    res.status(StatusCodes.OK).json({
      success: true,
      message: "Add  Beneficary Request",
      data,
    });
  } catch (error) {
    res.status(StatusCodes.SERVER_ERROR).json({
      status: "error",
      error: error.message,
    });
  }
};

exports.viewEmployeeRequest = async (req,res)=>{
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

exports.deleteEmployeeRequest = async (req, res) => {
  try {
    const data = await SupervisorRequest.find({
      type: "delete-employee",
    }).exec();
    res.status(StatusCodes.OK).json({
      success: true,
      message: "Beneficiary delete Request",
      data,
    });
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      status: "error",
      message: "Failed to retrieve the list of beneficiaries",
      error: error.message,
    });
  }
};

exports.approveEmployeeRequest = async(req,res)=>{
   const requestId = req.params.id; 

  try {
    const request = await SupervisorRequest.findById(requestId);

    if (!request) {
      return res.status(StatusCodes.NOT_FOUND).json({
        success: false,
        message: "Request not found",
      });
    }

    if (request.status === "approved" || request.status === "declined") {
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: "Request has already been processed",
      });
    }

   
    
      request.status = "approved";

    await request.save();

    res.status(StatusCodes.OK).json({
      success: true,
      message: "Request has been processed",
      data: request,
    });
  } catch (error) {

 res.status(StatusCodes.SERVER_ERROR).json({
   success: false,
   message: "Failed to process the request",
   error: error.message,
 });

  }
}

exports.declineEmployeeRequest = async (req,res)=>{

   const requestId = req.params.id;

   try {
     const request = await SupervisorRequest.findById(requestId);

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

}


exports.getBneneficiaryProfile = async(req,res) =>{
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
  
}


exports.redoEmployeeAction = async (req,res)=>{

}




exports.fetchBeneficiaryAttendance = async (req, res) => {
  const beneficiaryId = req.params.id; 

  try {
    const attendance = await Attendance.find({ beneficiaryId });

    if (attendance.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'No attendance records found for the beneficiary',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Beneficiary attendance fetched successfully',
      data: attendance,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch beneficiary attendance',
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
exports.getSupervisorsAndAdmin = async(req,res)=>{
  try{
const data = Users.find({ role: { $in: ["admin"] } }).exec();
res.status(200).json({
  success:true,
  message:"Successful",
  data:data,
})

  }
  catch(error){
res.status(500).json({
  success:false,
  message:"An error occured trying to fetch Admins and Supervisors",
  err: error.message
})
  }
};

exports.filterSupervisorByZone = async(req, res) => {
  const searchParam = req.params.id;
  try {
      if (!searchParam) {
        return res.status(400).json({ error: "Missing Zone parameter" });
      }

    const data = Users()
    const filteredData = data.filter(response =>{
      response.zone === searchParam
    })
    
    
    res.status(200).json({
      success: true,
      message: "Successful",
      filteredData,
    });



  } catch (error) {
    res.status(500).json({
      success: false,
      message: "An error occured trying to fetch Admins and Supervisors",
      err: error.message,
    });
  }
};



//SuperAdmin profile
