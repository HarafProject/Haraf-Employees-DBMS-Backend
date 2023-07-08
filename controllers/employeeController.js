const Employee = require("../models/employee");
const StatusCodes = require("../utils/status-codes");
// @desc  Create new bootcamp
// @route POST /api/bootcamps
// @access Private
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
            "ward", 
            "address",
            "age", 
            "workTypology", 
            "maritalStatus", 
            "specialAbility", 
            "householdSize", 
            "householdHead", 
            "gender", 
            "photo"]);
    
    employee = await employee.save();
  }
  res.status(StatusCodes.OK).json({
    success: true,
    message: "Employee added successfully",
    employee,
  });
};

exports.getEmployee = async (req, res) => {
  try {
    const employees = await Employee.find();
    return res.status(StatusCodes.OK).json({
      success: true,
      employees
    });
  } catch (error) {
    console.error(error);
    return res.status(StatusCodes.SERVER_ERROR).json({
      success: false,
      error: 'Internal Server Error'
    });
  }
};