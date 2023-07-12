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
router.post("/filter-by-work-topology", superadminController.filterByTopology);
router.post("/search", superadminController.searchBeneficiaries);

router.get("/all-ward", superadminController.getAllWards);


//Request routes
router.get('/delete-employee-request', superadminController.deleteEmployeeRequest);
router.get('/edit-employee-request',superadminController.editEmployeeRequest);
router.get('/add-employee-request',superadminController.addEmployeeRequest);
router.get("/all-employee-request", superadminController.viewAllEmployeeRequest);
router.get('/employee-request/:id', superadminController.viewEmployeeRequest);
router.post('/approve-employee-request', superadminController.approveEmployeeRequest);
router.post('/decline-employee-request', superadminController.declineEmployeeRequest);


//Attendance Reports
router.get("/all-zones-attendance",superadminController.allZonesAttendanceReport);
router.post("/a-zones-attendance",superadminController.zoneReport);
router.post("/filter-attendance-by-lga", superadminController.filterReportsByLGA);
router.post("/filter-attendance-by-date", superadminController.filterAttendanceByDate);


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