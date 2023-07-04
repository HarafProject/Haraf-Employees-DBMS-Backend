const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

const { validate, validateUser, loginValidator } = require('../middleware/validation');

router.post('/register', validate(validateUser), userController.registerUser);
router.post('/login', validate(loginValidator),userController.loginUser);
router.post('/forgot-pw', userController.forgot_password);
module.exports = router;