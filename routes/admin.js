const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const auth = require("../middleware/auth")
const role = require("../middleware/role")
const adminController = require("../controllers/adminController")
const { validate, validateAccount } = require('../middleware/validation');

//  Get the current user.
router.get('/me', auth, role(["admin","super-admin"]), userController.getUser)

router.post('/work-typology', auth,role(["admin","super-admin"]), adminController.work_typology);

module.exports = router;