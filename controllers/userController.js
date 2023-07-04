const { User } = require("../models/user");
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