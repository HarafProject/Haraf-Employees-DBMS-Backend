const { User } = require("../models/user");
const OTP = require("../models/OTP");
const StatusCodes = require("../utils/status-codes");
const bcrypt = require("bcrypt");

exports.registerUser = async (req, res) => {
  let user = await User.findOne({ email: req.body.email });

  if (user) return res.status(StatusCodes.BAD_REQUEST).json({error:"User already exist. Please contact Admin"});
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

  if(!user.isVerified) return res.status(StatusCodes.UNAUTHORIZED).json({ error: 'Un-Authorized action. Please contact Admin' });

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
  
    const user = await User.findOne({ email, });
  
    if (user) {
      const code = otpGenerator.generate(6, {
        lowerCaseAlphabets: false,
        upperCaseAlphabets: false,
        specialChars: false,
      });
  
      const otp = new OTP({
        _id: mongoose.Types.ObjectId(),
        user: user._id,
        checkModel: "User",
        code: code,
        type: "ForgotPassword",
        created_at: new Date(),
      });
  
      await otp.save();
  
      await Otp_ForgotPassword(user.email, code);
  
      // Generate user token that must be sent with the verification OTP
      const token = user.generateAuthToken();
      return res
        .header("AFCS-auth-token", token)
        .status(StatusCodes.OK).json({
          status: "success",
          message: "OTP sent to your email. Incase of any delay, check your email spam folder.",
          token
        });
    }
  
    return res.status(StatusCodes.BAD_REQUEST).json({
      status: "failed",
      error: "This Email does not exist on HARAF.",
    });
  
  }
  