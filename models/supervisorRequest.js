const mongoose = require("mongoose");
const supervisorRequestSchema = mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User' },
    reason: { type: String },
    type: { type: String, enum: ["add-employee", "edit-employee", "delete-employee"] },
    employee: { type: mongoose.Schema.Types.ObjectId, required: false, ref: 'Employee' },
    status: { type: String, enum: ["pending", "approved", "declined"], default: "pending" },

}, {
    timestamps: true,
});

module.exports = mongoose.model('SupervisorRequest', supervisorRequestSchema);