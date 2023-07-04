const mongoose = require("mongoose");
const OTPSchema = mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User' },
    code: { type: String },
    type: { type: String },
    expiresIn: { type: Date }
});

module.exports = mongoose.model('OTP', OTPSchema);


