const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const auth = require("../middleware/auth")
const role = require("../middleware/role")
const supervisorController = require("../controllers/supervisorController")
const { validate, validateAccount } = require('../middleware/validation');

//  Get the current user.
router.get('/me', auth, userController.getUser)

router.get('/work-typology', auth, supervisorController.work_typology)

router.get('/bank_list', auth, supervisorController.bank_list);

router.post('/bank-details', auth, validate(validateAccount), supervisorController.bank_details);

module.exports = router;