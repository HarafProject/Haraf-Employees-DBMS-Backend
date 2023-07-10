const jwt = require("jsonwebtoken");

const mongoose = require("mongoose");
const adminSchema = new mongoose.Schema({
    reference: { type: String, required: true, unique: true },
  firstname: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 250
  },
  surname: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 250
  },
  email: {
    type: String,
    required: true,
    minlength: 3,
    maxlength: 255,
    unique: true,
    match: /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
  },
  phone: {
    type: String,
    required: true
  },
  zone: {
    type: mongoose.Schema.Types.ObjectId, required: true, ref: 'Zone'
  },
  lga: {
    type: mongoose.Schema.Types.ObjectId, required: true, ref: 'LGA'
  },
  password: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 1024
  },
  role: {
    type: String,
    enum: ['super-admin', "admin"],
    default: 'admin'
  },
  operations: {
    type: String,
    enum: ["create", "read", "update", "delete", "super"],
    default: "read"
  },
  isVerified: {
    type: Boolean,
    default: false
  },
  resetPassword: { type: Boolean, default: false },
  resendOTP: {
    resend: {

      type: Boolean, default: false
    },
    numberSent: {
      type: Number
    },
    lastSent: {
      type: Date,
    }
  }

}, {
  timestamps: true,
});
adminSchema.methods.generateAuthToken = function () {
  const token = jwt.sign(
    {
      _id: this._id,
      firstname: this.firstname,
      surname: this.surname,
      email: this.email,
      phone: this.phone,
      role: this.role,
      password: this.password,
      zone: this.zone,
      lga: this.lga,
      operations: this.operations
    },
    process.env.JWT,
    {
      expiresIn: "1d",
    }
  );
  return token;
};

const Admin = mongoose.model("Admin", adminSchema);

exports.Admin = Admin;