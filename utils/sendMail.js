// const image = require('./legumes.jpg')
const nodemailer = require("nodemailer");
const config = require("../config.js/keys");
const path = require('path');
// const smtpTransport = require('nodemailer-smtp-transport');


exports.Otp_ForgotPassword = async (email, otp) => {
  try {
    const transporter = nodemailer.createTransport({
      service: config.SERVICE,
      secure: true,
      auth: {
        pass: config.PASSMAILER,
        user: "activefarmersinfo@gmail.com"
      },
    });

    await transporter.sendMail({
      from: "activefarmersinfo@gmail.com",
      to: email,
      subject: ' HARAF EDMS Reset Password',
      html:` <b> Hi Dear </b></br>
        <p>We recieved a request to reset the Password on your HARAF EDMS Service Account.</p>
        </br>
        <p>Please enter this code to complete password reset.</p>
        </br>
        </br>
        <b>${otp}</b>
        </br>
        </br>
        <p>Thanks for helping us keep your account secure. </p>`,

    });
    console.log("email sent sucessfully");

  } catch (error) {
    console.log(error, "email not sent");
  }
};

