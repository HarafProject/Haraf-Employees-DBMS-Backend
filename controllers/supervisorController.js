const { default: mongoose } = require("mongoose");
const { bankList, verifyAccount } = require("../utils/paystack");
const StatusCodes = require("../utils/status-codes");
const WorkTypology = require("../models/workTypology");
const Employee = require("../models/employee");
const Request = require("../models/supervisorRequest")
const Attendance = require("../models/attendance")
const AttendanceRecord = require("../models/attendanceRecord")
const cloudinary = require("../utils/cloudinary");

exports.bank_details = async (req, res) => {
    const { accountNumber, bankCode, bankName } = req.body;

    // Verify bank account number
    const result = await verifyAccount(accountNumber, bankCode);

    // Invalid account number
    if (!result.status) {
        return res.status(StatusCodes.UNPROCESSABLE_ENTITY).json({
            status: "failed",
            error: result.message,
        });
    }

    const bankDetails = {
        accountNumber,
        bankCode,
        accountName: result.data.account_name,
        bankName,

    };

    return res.status(StatusCodes.OK).json({
        status: "success",
        message: "Bank details verified successfully.",
        bankDetails
    });
};

exports.bank_list = async (req, res) => {

    const { data } = await bankList();
    return res.status(StatusCodes.OK).json({
        status: "success",
        banks: data

    });
}

exports.work_typology = async (req, res) => {
    const workTypology = await WorkTypology.find().exec()

    res.status(StatusCodes.OK).json({
        status: "success",
        workTypology
    });
}

exports.addEmployee = async (req, res) => {

    let employee = await Employee.findOne({ phone: req.body.phone });
    if (employee) return res.status(StatusCodes.BAD_REQUEST).json({ error: "Employee already exist. Please contact Admin" });
    // If employee does not exist, add
    if (!employee) {
        employee = new Employee(req.body,
            [
                "fullName",
                "phone",
                "accountNumber",
                "bankName",
                "zone",
                "lga",
                "ward",
                "address",
                "age",
                "workTypology",
                "maritalStatus",
                "specialDisability",
                "householdSize",
                "householdHead",
                "sex",
            ]);

        const result = await cloudinary.uploader.upload(req.file.path);
        employee.photo = result.secure_url

        employee = await employee.save();
    }
    res.status(StatusCodes.OK).json({
        success: true,
        message: "Employee added successfully",
        employee,
    });
};

exports.getEmployee = async (req, res) => {
    const employees = await Employee.find({ lga: req.user.lga })
        .populate("workTypology", "name")
        .populate("zone", "name")
        .populate("lga", "name")
        .populate("ward", "name");
    return res.status(StatusCodes.OK).json({
        success: true,
        employees
    });
};

exports.new_employee_request = async (req, res) => {

    const { reason } = req.body
    const newRequest = new Request({
        user: req.user._id,
        reason,
        type: "new-employee"
    })
    await newRequest.save()

    res.status(StatusCodes.OK).json({
        status: "success",
        message: "Request Sent successfully"

    });
}

exports.delete_employee_request = async (req, res) => {

    const { reason, employeeId } = req.body
    const newRequest = new Request({
        user: req.user._id,
        reason,
        type: "delete-employee",
        employee: employeeId
    })
    await newRequest.save()

    res.status(StatusCodes.OK).json({
        status: "success",
        message: "Request Sent successfully"

    });
}

exports.edit_employee_request = async (req, res) => {

    const { reason, employeeId } = req.body
    const newRequest = new Request({
        user: req.user._id,
        reason,
        type: "edit-employee",
        employee: employeeId
    })
    await newRequest.save()

    res.status(StatusCodes.OK).json({
        status: "success",
        message: "Request Sent successfully"

    });
}

exports.submit_attendance = async (req, res) => {

    const { comment, reason, zone, lga, date, attendanceRecord } = req.body;

    // Check if attendance has already been submitted
    let attendance = await Attendance.findOne({
        lga,
        date
    })
    if (attendance) return res.status(StatusCodes.BAD_REQUEST).json({ error: "Attendance for this LGA has already been submitted." });

    attendance = Attendance({
        _id: new mongoose.Types.ObjectId(),
        submittedBy: req.user._id,
        comment,
        reason,
        zone,
        lga,
        date,

    })
    let record = []
    
    attendanceRecord.forEach(async (item) => {
        let employeeRecord = new AttendanceRecord({
            _id: new mongoose.Types.ObjectId(),
            supervisor: item.supervisor,
            employee: item.employee,
            attendance: attendance._id,
            attempt: item.attempt,
            date,
            status: item.status,
            zone: item.zone,
            lga: item.lga,
            ward: item.ward,
            workTypology: item.workTypology
        })
        record.push(employeeRecord._id)
        await employeeRecord.save()
    })

    attendance.attendanceRecord = record
    await attendance.save()

    res.status(StatusCodes.OK).json({
        status: "success",
        message: "Attendance Submitted successfully"

    });
}
