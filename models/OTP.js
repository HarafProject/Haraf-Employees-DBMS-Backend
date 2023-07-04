const mongoose = require("mongoose");
const OTPSchema = mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, required: true, refPath: 'checkModel' },
    checkModel: {
        type: String,
        ref: 'User',
        // required: true,
    },
    code: { type: String },
    type: { type: String },
    expiresIn: { type: Date }
});

module.exports = mongoose.model('OTP', OTPSchema);


