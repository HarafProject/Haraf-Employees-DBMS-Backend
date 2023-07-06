const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const auth = require("../middleware/auth")
const role = require("../middleware/role")
const supervisorController = require("../controllers/supervisorController")
const { validate, validateAccount, supervisorRequest, validateEmployee, attendance } = require('../middleware/validation');

const upload = require("../utils/multer");

//  Get the current user.
router.get('/me', auth, userController.getUser)

router.get('/work-typology', auth, supervisorController.work_typology)

router.get('/bank_list', auth, supervisorController.bank_list);

router.post('/bank-details', auth, validate(validateAccount), supervisorController.bank_details);

//add employee
router.post('/add-employee', auth, upload.single('uploaded_file'), validate(validateEmployee), supervisorController.addEmployee);

//get all employees
router.get('/employee', auth, supervisorController.getEmployee);

router.post('/new-employee-request', auth, validate(supervisorRequest), supervisorController.new_employee_request);

router.post('/delete-employee-request', auth, validate(supervisorRequest), supervisorController.delete_employee_request);

router.post('/edit-employee-request', auth, validate(supervisorRequest), supervisorController.edit_employee_request);

router.post('/attendance', auth, validate(attendance), supervisorController.submit_attendance);


module.exports = router;