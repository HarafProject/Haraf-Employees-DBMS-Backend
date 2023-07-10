const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const auth = require("../middleware/auth")
const role = require("../middleware/role")
const adminController = require("../controllers/adminController")
const { validate, validateAccount } = require('../middleware/validation');
const beneficiaryController = require('../controllers/beneficiaryController');

//  Get the current user.
router.get('/me',  userController.getUser)

router.post('/work-typology', auth,role(["admin","super-admin"]), adminController.work_typology);

router.get('/beneficiaries',beneficiaryController.getAllBeneficiary )
module.exports = router;