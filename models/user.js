const jwt = require("jsonwebtoken");
const Joi = require("joi");
const mongoose = require("mongoose");
const userSchema = new mongoose.Schema({
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
        minlength: 5,
        maxlength: 255,
        unique: true,
        match: /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      },
    phone: {
        type: String,
        required: true
      },
    region:{
        type: String,
        require: true,
      },
    lga: {
         type: String,
         require: true,
      },
    password: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 1024
      },
    role: {
        type: String,
        enum: ['user', 'supervisor'],
        default: 'user'
      },
    isVerified: {
        type: Boolean,
        default: false
    },


});
userSchema.methods.generateAuthToken = function () {
    const token = jwt.sign(
      {
        _id: this._id,
        firstname: this.firstname,
        surname: this.surname,
        email: this.email,
        phone: this.phone,
        region: this.region,
        lga: this.lga,
        password: this.password,
      },
      process.env.JWT,
      {
        expiresIn: "1d",
      }
    );
    return token;
  };
  
  const User = mongoose.model("User", userSchema);
 
  exports.User = User;