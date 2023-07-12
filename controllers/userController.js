const User = require("../models/user");
const OTP = require("../models/OTP");
const StatusCodes = require("../utils/status-codes");
const bcrypt = require("bcrypt");
const otpGenerator = require("otp-generator");
const { Otp_ForgotPassword } = require("../utils/sendMail")
const generateUniqueId = require('generate-unique-id');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');
const Ward = require("../models/ward");

exports.registerUser = async (req, res) => {
  let user = await User.findOne({ email: req.body.email });

  if (user) return res.status(StatusCodes.BAD_REQUEST).json({ error: "User already exist. Please contact Admin" });
  // If user does not exist, create
  if (!user) {
    //generate order id
    let userID = generateUniqueId({
      length: 10,
      useLetters: false
    });
    //make sure the order id is unique
    let id_check = await User.findOne({ reference: userID }).exec();
    while (id_check !== null) {
      userID = generateUniqueId({
        length: 10,
        useLetters: false
      });

      id_check = await User.findOne({ reference: userID }).exec();
    }
    req.body.reference = userID
    user = new User(req.body, ["firstname", "surname", "reference", "email", "phone", "region", "lga", "password"]);
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(user.password, salt);
    user = await user.save();
  }

  // const token = user.generateAuthToken();
  res.status(StatusCodes.OK).json({
    status: "Success",
    message: "Account Created",
    // token,
  }

  );
};

//*************************User login******************
exports.loginUser = async (req, res) => {
  let user = await User.findOne({ email: req.body.email })
    .exec()
  if (!user) return res.status(422).json({ error: 'Invalid Credentials.' });
  const validPassword = await bcrypt.compare(req.body.password, user.password);
  if (!validPassword) return res.status(422).json({ error: 'Invalid credentials' });

  if (!user.isVerified) return res.status(StatusCodes.UNAUTHORIZED).json({ error: 'Un-Authorized action. You have not been granted access yet. please contact admin.' });

  const token = user.generateAuthToken();
  const wards = await Ward.find({ lga: user.lga }).sort({ name: "asc" }).populate('lga', '_id name').exec();
  user = {
    _id: user._id,
    firstname: user.firstname,
    surname: user.surname,
    phone: user.phone,
    email: user.email,
    role: user.role,
    zone: user.zone,
    lga: user.lga,
    operation: user.operations,
  }

  res.status(StatusCodes.OK).json({
    status: "Success",
    message: "User Login Successfull",
    user,
    wards,
    token
  });

}
//************************************ Forgot password ********************************************/
exports.forgot_password = async (req, res) => {

  const { email } = req.body;

  const user = await User.findOne({ email });

  if (!user) return res.status(StatusCodes.NOT_FOUND).json({
    status: "failed",
    error: "This Email does not exist on HARAF.",
  });

  const code = otpGenerator.generate(6, {
    lowerCaseAlphabets: false,
    upperCaseAlphabets: false,
    specialChars: false,
  });

  const otp = new OTP({
    user: user._id,
    code: code,
    type: "ForgotPassword",
    created_at: new Date(),
  });

  await otp.save();

  await Otp_ForgotPassword(user.email, code);

  // Generate user token that must be sent with the verification OTP
  const token = user.generateAuthToken();
  return res
    .status(StatusCodes.OK).json({
      status: "success",
      message: "OTP sent to your email. Incase of any delay, check your email spam folder.",
      token
    });

}

//Verify Email token entered by user.
exports.verify_email_token = async (req, res) => {

  const { token } = req.body

  if (!token) {
    return res.status(StatusCodes.UNPROCESSABLE_ENTITY).json({ error: `please enter the token sent to ${req.user.email}` })
  }

  //check otp code
  const otp = await OTP.findOne({ code: token })
    .populate("user", "_id email")
    .exec();

  if (!otp) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      status: 'failed',
      error: 'Invalid OTP code'
    });
  }
  if (otp.user.email !== req.user.email) {

    return res.status(StatusCodes.BAD_REQUEST).json({
      status: 'failed',
      error: 'Invalid Token Credentials'
    });
  }
  //delete otp code
  await OTP.findOneAndDelete({ code: token }).exec();

  await User.findByIdAndUpdate(otp.user._id, {
    resetPassword: true
  }, {
    new: true
  })
  return res.status(StatusCodes.OK).json({
    status: 'success',
    message: 'OTP verified, You can now reset Password'
  });
}

exports.reset_password = async (req, res) => {
  const { password } = req.body
  // Only users with valid OTP can reset password. hence resetPassword=true
  let user = await User.findOne({ email: req.user.email, resetPassword: true }).exec();

  // This user is not on the app
  if (!user) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      status: "failed",
      error: "Invalid credentials",
    });
  }
  // hash the password
  const salt = await bcrypt.genSalt(10);
  const hashed_password = await bcrypt.hash(password, salt);

  user.password = hashed_password;
  user.resetPassword = false;

  await user.save();
  res.status(StatusCodes.OK).json({
    status: 'success',
    message: 'You have successfully reset your password',

  });

}

exports.getUser = async (req, res) => {
  const user = await User.findById(req.user._id)
    .select("-password -isVerified -resetPassword -resendOTP")
    .populate("zone", "_id name")
    .populate("lga", "_id name");
  res.status(StatusCodes.OK).json(user);
}
// **************** Get all Users only admin and super-admin*******************
exports.getUsers = async (req, res) => {
  const users = await User.find({ role: "supervisor" })
    .select("-password -resetPassword -resendOTP")
    .populate("zone", "_id name")
    .populate("lga", "_id name");
  res.status(StatusCodes.OK).json({
    success: true,
    data: users
  });
}

//**********************************Update User **********************/

exports.updateSupervisor = asyncHandler(async (req, res, next) => {
  let user = await User.findById(req.params.id);

  if (!user) {
    return next(
      new ErrorResponse(`Supervisor not found with id of ${req.params.id}`, 404)
    );
  }

  user = await User.findOneAndUpdate({ _id: req.params.id }, req.body, {
    new: true,
    runValidators: true
  });

  res.status(200).json({
    success: true,
    message: "Account Updated"
  });
});

exports.editProfile = async (req, res) => {
  const { firstname, surname, phone } = req.body
  const user = await User.findByIdAndUpdate(req.user._id, {
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


