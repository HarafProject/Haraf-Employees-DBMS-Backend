const express = require('express');
const router = express.Router();
const {  validate, validateAdmin, loginValidator } = require("../middleware/validation");
const superadminController = require('../controllers/superadminController');
const adminController = require('../controllers/adminController');
const auth = require("../middleware/auth")
const role = require("../middleware/role")
//Create Account
router.post("/create-account", validate(validateAdmin), superadminController.createSuperAdmin);
router.post("/login", validate(loginValidator), superadminController.login);
router.put('/:id', auth, role("super-admin"),adminController.updateadmin);
module.exports = router;