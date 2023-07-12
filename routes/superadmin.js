const express = require('express');
const router = express.Router();
const {  validate, validateAdmin, loginValidator } = require("../middleware/validation");
const superadminController = require('../controllers/superadminController');
const adminController = require('../controllers/adminController');
const auth = require("../middleware/auth")
const role = require("../middleware/role")
const beneficiaryController = require('../controllers/beneficiaryController');

//Create Account
router.post("/create-account", validate(validateAdmin), superadminController.createSuperAdmin);
router.post("/login", validate(loginValidator), superadminController.login);
router.put('/:id', auth, role("super-admin"),adminController.updateadmin);


router.get('/all-supervisor', superadminController.getAllSupervisors);
router.get('/beneficiary-profile/:id', superadminController.getBneneficiaryProfile)
router.get("/all-beneficiaries", beneficiaryController.getAllBeneficiary);
router.post('/filter-by-lga', superadminController.filterByLGA)
router.post("/filter-by-zones", superadminController.filterByZones);
router.post("/filter-by-wards", superadminController.filterByWards);
router.post("/filter-by-work-topology", superadminController.filterByLGA);
router.post("/search", superadminController.searchBeneficiaries);


//Request routes
router.get('/delete-employee-request', superadminController.deleteEmployeeRequest);
router.get('/edit-employee-request',superadminController.editEmployeeRequest);
router.get('/add-employee-request',superadminController.addEmployeeRequest);
router.get('/employee-request/:id', superadminController.viewEmployeeRequest);
router.get('/approve-employee-request/:id', superadminController.approveEmployeeRequest);
router.get('/decline-employee-request/:id', superadminController.declineEmployeeRequest);

//Attendance
router.get('/beneficiary-attendance/:id',superadminController.fetchBeneficiaryAttendance);
router.get('/beneficiary-present-attendance/:id',superadminController.fetchBeneficiaryPresentAttendance);
router.get("/beneficiary-absent-attendance/:id",superadminController.fetchBeneficiaryAbsentAttendance
);
router.get("/attendance-details", superadminController.fetchAttendanceDetails);

//Manage supervisors
router.get("/list-of-admins-and-supervisors", superadminController.getSupervisorsAndAdmin);
router.get("/filter-supervisors-by-zones/:id", superadminController.filterSupervisorByZone);


module.exports = router;