const express = require('express');
const employeeController = require('../controllers/employeeController');
const auth = require("../middleware/auth")
const { validate, validateEmployee } = require('../middleware/validation');
const router = express.Router();
//add employee
router.post('/add-employee', auth, validate(validateEmployee), employeeController.addEmployee);
//get all employees
router.get('/employee', auth, employeeController.getEmployee);
module.exports = router;