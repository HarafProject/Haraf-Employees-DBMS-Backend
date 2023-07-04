const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const auth = require("../middleware/auth")

const { validate, validateUser, loginValidator } = require('../middleware/validation');

router.post('/register', validate(validateUser), userController.registerUser);
router.post('/login', validate(loginValidator), userController.loginUser);
router.post('/forgot-pw', userController.forgot_password);

//Verify Email token Entered by User after forgot password
router.post('/verify-token', auth, userController.verify_email_token);

router.put('/reset-pw', auth, userController.reset_password);

module.exports = router;