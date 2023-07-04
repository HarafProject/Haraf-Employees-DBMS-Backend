const mongoose = require("mongoose");
const supervisorRequestSchema = mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User' },
    reason: { type: String },
    type: { type: String, enum:["new-employee","edit-employee"] },
    employee: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User' },
    expiresIn: { type: Date }
});

module.exports = mongoose.model('SupervisorRequest', supervisorRequestSchema);