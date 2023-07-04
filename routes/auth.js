const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { valid } = require('joi');
const { validate, validateUser, loginValidator } = require('../middleware/validation');

router.post('/register', validate(validateUser), userController.registerUser);
router.post('/login', validate(loginValidator),userController.loginUser);

module.exports = router;