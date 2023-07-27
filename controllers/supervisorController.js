const { default: mongoose } = require("mongoose");
const { bankList, verifyAccount } = require("../utils/paystack");
const StatusCodes = require("../utils/status-codes");
const WorkTypology = require("../models/workTypology");
const Employee = require("../models/employee");
const Request = require("../models/supervisorRequest")
const Attendance = require("../models/attendance")
const AttendanceRecord = require("../models/attendanceRecord")
const cloudinary = require("../utils/cloudinary");
const SupervisorNotification = require("../models/notifySupervisor")
const { Verify_BVN, BVN_Bank_List } = require("../utils/bvnVerification")

exports.getNotifications = async (req, res) => {
    const notifications = await SupervisorNotification.find({ supervisor: req.user._id })
        .sort({ createdAt: -1 })
        .populate({
            path: 'request',
            populate: {
                path: 'employee',
                model: 'Employee',
                select: "fullName"
            }
        })
        .exec()

    res.status(StatusCodes.OK).json({
        status: "success",
        notifications
    });
}

exports.verify_Beneficiary_BVN = async (req, res) => {
    const { accountNumber, bankcode, firstname, lastname, bankName } = req.body;

    // Verify bank account number
    const result = await Verify_BVN(firstname, lastname, accountNumber, bankcode);


    // Invalid account number
    if (!result.bvn) {
        return res.status(StatusCodes.UNPROCESSABLE_ENTITY).json({
            status: "failed",
            error: result
        });
    }
    const beneficiaryExist = await Employee.findOne({
        accountNumber,
        BVN: result.bvn
    })

    if (beneficiaryExist) return res.status(StatusCodes.UNPROCESSABLE_ENTITY).json({
        status: "failed",
        error: "Beneficiary verification failed. BVN already registered."
    });

    const bankDetails = {
        fullName: `${result?.firstname} ${result?.middlename} ${result?.lastname}`,
        accountNumber,
        bankName,
        bankCode: bankcode,
        bvn: result.bvn,
        photo: result.photo,
        gender: result.gender

    };

    return res.status(StatusCodes.OK).json({
        status: "success",
        message: "Beneficiary details verified successfully.",
        bankDetails
    });
};

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

    const data = await BVN_Bank_List();
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

    let employee = await Employee.findOne({
        $or: [
            { accountNumber: req.body.accountNumber },
            { phone: req.body.phone },
            { BVN: req.body.BVN }
        ]
    });
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
                "BVN"
            ]);

        if (req?.file) {
            const result = await cloudinary.uploader.upload(req.file.path);
            employee.photo = result.secure_url
        }

        employee.zone = req.user.zone
        employee.lga = req.user.lga

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
        .sort({ createdAt: -1 })
        .populate("workTypology", "name")
        .populate("zone", "name")
        .populate("lga", "name")
        .populate("ward", "name");

    return res.status(StatusCodes.OK).json({
        success: true,
        employees
    });
};

exports.getSingleEmployee = async (req, res) => {
    const employee = await Employee.findById(req.params.id)
        .populate("workTypology", "name")
        .populate("zone", "name")
        .populate("lga", "name")
        .populate("ward", "name");
    return res.status(StatusCodes.OK).json({
        success: true,
        employee
    });
};

exports.deleteEmployee = async (req, res) => {
    const { notification } = req.query

    await Employee.softDeleteOne({ _id: req.params.id })
    const a = await SupervisorNotification.findByIdAndUpdate(notification, {
        $set: {
            actionTaken: true
        }
    })
    return res.status(StatusCodes.CREATED).json({
        status: 'success',
        message: "Beneficiary account have been deleted successfully.",
    });
};

exports.updateSingleEmployee = async (req, res) => {
    const { notification } = req.query

    if (req.file) {
        const result = await cloudinary.uploader.upload(req.file.path);
        req.body.photo = result.secure_url
    }

    const updatedEmployee = await Employee.findByIdAndUpdate(req.params.id, req.body, {
        new: true
    })
        .populate("ward")
        .populate("workTypology")
        .exec()
    const a = await SupervisorNotification.findByIdAndUpdate(notification, {
        $set: {
            actionTaken: true
        }
    })
    return res.status(StatusCodes.OK).json({
        success: true,
        message: "Employee details updated successfully.",
        updatedEmployee
    });


};

exports.new_employee_request = async (req, res) => {

    const { reason } = req.body
    const newRequest = new Request({
        user: req.user._id,
        reason,
        type: "add-employee"
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
        message: "Request Sent successfully. Please await admin approval."

    });
}

exports.edit_employee_request = async (req, res) => {

    const { reason, employeeId } = req.body
    if (!employeeId || !reason) return res.status(StatusCodes.UNPROCESSABLE_ENTITY).json({ error: "All data are required" })

    const newRequest = new Request({
        user: req.user._id,
        reason,
        type: "edit-employee",
        employee: employeeId
    })
    await newRequest.save()

    res.status(StatusCodes.OK).json({
        status: "success",
        message: "Request Sent successfully.Please await admin approval."

    });
}

exports.submit_attendance = async (req, res) => {

    const { comment, reason, zone, lga, date, attendanceRecord } = req.body;

    // Check if attendance has already been submitted
    let attendance = await Attendance.findOne({
        lga,
        date,
        submittedBy: req.user._id
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

exports.get_attendance_report = async (req, res) => {

    let attendance = await Attendance.find({ lga: req.user.lga })
        .sort({ date: -1 })
        .populate("submittedBy", "firstname surname")
        .populate("zone")
        .populate("lga")
        .populate({
            path: 'attendanceRecord',
            populate: [
                { path: 'supervisor', select: '-password' },
                'employee',
                'zone',
                'lga',
                'ward',
                'workTypology'
            ]
        })
        .exec();

    res.status(StatusCodes.OK).json({
        status: "success",
        data: attendance

    });
}
