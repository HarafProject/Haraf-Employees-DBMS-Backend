const mongoose = require('mongoose');


const supervisorVerificationSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    status:{
        type:String,
        enum:['Unverified','Verified'],
        default:'Unverified'
    }
  },
  { timestamp: true }
);

module.exports = mongoose.model('SupervisorVerification', supervisorVerificationSchema)