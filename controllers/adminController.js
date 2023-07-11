const StatusCodes = require("../utils/status-codes");
const WorkTypology = require("../models/workTypology");
const { Admin } = require("../models/admin");
const bcrypt = require("bcrypt");
const generateUniqueId = require('generate-unique-id');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');
const Supervisor = require('../models/user');



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
  
    res.status(StatusCodes.OK).json({
      status: "Success",
      message: "Login Successfull",
      token,
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
        message: "Account Updated"});
  });




  

exports.get