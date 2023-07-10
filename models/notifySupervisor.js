const { default: mongoose } = require("mongoose");

const supervisorNotificationSchema = mongoose.Schema({
    supervisor: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User' },
    request: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'SupervisorRequest' },
    reason: { type: String },
    actionTaken: { type: Boolean, default:false }

}, {
    timestamps: true,
});


module.exports = mongoose.model('SupervisorNotification', supervisorNotificationSchema);