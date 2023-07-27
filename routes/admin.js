const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const auth = require("../middleware/auth")
const role = require("../middleware/role")
const adminController = require("../controllers/adminController")
const { validate, validateAdmin, loginValidator } = require('../middleware/validation');
const beneficiaryController = require('../controllers/beneficiaryController');

//  Get the current user.
router.get('/me',  userController.getUser)
// Create acess code for admins
router.post("/confirm-code", adminController.confirmCode);
router.post('/work-typology', auth,role(["admin","super-admin"]), adminController.work_typology);
router.get('/supervisors', auth, role(["admin","super-admin"]), userController.getUsers);
router.put('/supervisor/:id', auth, role(["admin", "super-admin"]),userController.updateSupervisor);
router.put('/handle-request/:id', auth, role(["admin", "super-admin"]),adminController.handleSupervisorRequest);
//Create Admin
router.post("/create-admin", validate(validateAdmin), adminController.createAdmin);

router.post("/login", validate(loginValidator), adminController.login);

router.get('/data-summary',auth,role(["admin", "super-admin"]),adminController.getDataSummary);

router.get('/all-beneficiaries',auth,role(["admin", "super-admin"]), beneficiaryController.getAllBeneficiary);

router.get('/beneficiary-attendance-summary/:id',auth,role(["admin", "super-admin"]), beneficiaryController.getBeneficiaryAttendnanceSummary);

router.get('/attendance-dates',auth,role(["admin", "super-admin"]), adminController.getUniqueAttendanceDates);

router.get('/attendance-weeks',auth,role(["admin", "super-admin"]), adminController.getUniqueAttendanceWeeks);

router.get('/beneficiary-attendance-analytics',auth,role(["admin", "super-admin"]), adminController.getBeneficiaryAttendnanceAnalytics);

router.get('/beneficiary-attendance-analytics/report',auth,role(["admin", "super-admin"]), adminController.getBeneficiaryAttendnanceData);

module.exports = router;