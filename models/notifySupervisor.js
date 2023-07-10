const { default: mongoose } = require("mongoose");

const supervisorNotification = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    supervisor: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User' },
    employee:{ type: mongoose.Schema.Types.ObjectId, required: false, ref: 'Employee' },
    attendance:{ type: mongoose.Schema.Types.ObjectId, required: true, ref: 'Attendance' },
    attempt: [{
        status: { type: String, required: true,enum: ["Present", "Absent"] },
        date: { type: Date, required: true }
    }],
    date: { type: Date, required: true },
    status: { type: String, enum: ["Present", "Absent"] },//This is for late submission
    zone: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'Zone' },
    lga: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'LGA' },
    ward: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'Ward' },
    workTypology: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'WorkTypology' },

}, {
    timestamps: true,
});


module.exports = mongoose.model('SupervisorNotification', supervisorNotificationSchema);