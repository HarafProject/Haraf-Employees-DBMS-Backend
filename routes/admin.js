const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const auth = require("../middleware/auth")
const role = require("../middleware/role")
const adminController = require("../controllers/adminController")
const { validate, validateAdmin, loginValidator } = require('../middleware/validation');

//  Get the current user.
router.get('/me', auth, role(["admin","super-admin"]), userController.getUser)

router.post('/work-typology', auth,role(["admin","super-admin"]), adminController.work_typology);
router.get('/supervisors', auth, role(["admin","super-admin"]), userController.getUsers);
router.put('/supervisor/:id', auth, role(["admin", "super-admin"]),userController.updateSupervisor);
//Create Admin
router.post("/create-admin", validate(validateAdmin), adminController.createAdmin);
router.post("/login", validate(loginValidator), adminController.login);

module.exports = router;