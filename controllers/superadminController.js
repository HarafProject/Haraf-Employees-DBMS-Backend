const StatusCodes = require("../utils/status-codes");
const { SuperAdmin } = require("../models/superadmin");
const Supervisor = require("../models/user");
const Zone = require('../models/zone');
const Employee = require('../models/employee');
const SupervisorRequest = require('../models/supervisorRequest');


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
      const data = await Supervisor.find();
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

  exports.getReportsReceived = async(req,res)=>{
    try{
     
    }
    catch(error){

    }
  }

   exports.getLGASupervisors = async (req, res) => {
     try {
      const data = await  User.find();
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


exports.filterByLGA = (req, res) => {
  const targetLGA = req.body.lga; 

  if (!targetLGA) {
    return res.status(400).json({ error: 'Missing LGA parameter' });
  }

  const filteredBeneficiaries = Employee.filter((employee) => {
    return employee.lga.toLowerCase() === targetLGA.toLowerCase();
  });

  res.status(StatusCodes.OK).json({
   success:true,
   message:'Filter by LGA',
   data: filtered
  });
};





exports.filterByZones = (req, res) => {
  const targetZone = req.body.zone;

  if (!targetZone) {
    return res.status(400).json({ error: "Missing Zone parameter" });
  }

  const filteredBeneficiaries = Employee.filter((employee) => {
    return employee.zone.toLowerCase() === targetZone.toLowerCase();
  });

  res.status(StatusCodes.OK).json({
    success: true,
    message: "Filtered  by Zone",
    data: filtered,
  });
};

exports.filterByWards = (req, res) => {
  const targetward = req.body.ward;

  if (!targetward) {
    return res.status(400).json({ error: "Missing ward parameter" });
  }

  const filteredBeneficiaries = Employee.filter((employee) => {
    return employee.ward.toLowerCase() === targetward.toLowerCase();
  });

  res.status(StatusCodes.OK).json({
    success: true,
    message: "Filtered  by Zone",
    data: filtered,
  });
};

exports.searchBeneficiaries = (req, res) => {
  const searchQuery = req.body.searchParams; 


  if (!searchQuery) {
    return res.status(400).json({ error: "Missing search query parameter" });
  }

  const searchResults = Employee.filter((beneficiary) => {
    const beneficiaryName = beneficiary.fullName.toLowerCase();
    const query = searchQuery.toLowerCase();
    return beneficiaryName.includes(query);
  });

  res.status(StatusCodes.OK).json({
    success: true,
    message: "search result",
    beneficiaries: searchResults,
  });
};


exports.getEmployeeDeleteRequest = async(req,res)=>{
  request = SupervisorRequest.find({ type: "delete-employee" });
}