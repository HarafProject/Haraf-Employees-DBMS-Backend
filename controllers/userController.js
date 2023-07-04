const { User } = require("../models/user");
const OTP = require("../models/OTP");
const StatusCodes = require("../utils/status-codes");
const bcrypt = require("bcrypt");
const otpGenerator = require("otp-generator");
const { Otp_ForgotPassword } = require("../utils/sendMail")

exports.registerUser = async (req, res) => {
  let user = await User.findOne({ email: req.body.email });

  if (user) return res.status(StatusCodes.BAD_REQUEST).json({ error: "User already exist. Please contact Admin" });
  // If user does not exist, create
  if (!user) {
    user = new User(req.body, ["firstname", "surname", "email", "phone", "region", "lga", "password"]);
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(user.password, salt);
    user = await user.save();
  }

  const token = user.generateAuthToken();
  res.status(StatusCodes.OK).json({
    status: "Success",
    message: "Account Created",
    token,
  }

  );
};

//*************************User login******************
exports.loginUser = async (req, res) => {
  let user = await User.findOne({ email: req.body.email });
  if (!user) return res.status(400).json({ error: 'Invalid Credentials.' });
  const validPassword = await bcrypt.compare(req.body.password, user.password);
  if (!validPassword) return res.status(422).json({ error: 'Invalid credentials' });

  if (!user.isVerified) return res.status(StatusCodes.UNAUTHORIZED).json({ error: 'Un-Authorized action. Please contact Admin' });

  const token = user.generateAuthToken();

  res.status(StatusCodes.OK).json({
    status: "Success",
    message: "User Login Successfull",
    token,
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
