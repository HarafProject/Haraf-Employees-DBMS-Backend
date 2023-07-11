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
router.get("/all-beneficiaries", beneficiaryController.getAllBeneficiary);
router.post('/filter-by-lga', superadminController.filterByLGA)
router.post("/filter-by-zones", superadminController.filterByZones);
router.post("/filter-by-wards", superadminController.filterByWards);
router.post("/filter-by-work-topology", superadminController.filterByLGA);
router.post("/search", superadminController.searchBeneficiaries);


module.exports = router;