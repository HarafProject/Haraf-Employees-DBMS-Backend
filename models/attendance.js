const { default: mongoose } = require("mongoose");

const attendanceSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    submittedBy: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User' },
    comment: { type: String, required:true },
    reason: {type: String,},//This is for late submission
    zone:{ type: mongoose.Schema.Types.ObjectId, required: true, ref: 'Zone' },
    lga: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'LGA' },
    date:{ type: Date, required: true },
    attendanceRecord:[{ type: mongoose.Schema.Types.ObjectId, required: true, ref: 'AttendanceRecord' }]

}, {
    timestamps: true,
});


module.exports = mongoose.model('Attendance', attendanceSchema);