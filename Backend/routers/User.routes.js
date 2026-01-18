const express = require('express');
const router = express.Router();
const {body} = require('express-validator');
const userController = require('../Controllers/User.controller');
const authmiddleware = require('../middleware/auth.middleware');

router.post('/signup',
    [body('firstName').notEmpty().withMessage('First name is required'),
    body('lastName').notEmpty().withMessage('Last name is required'),
    body('email').isEmail().withMessage('Valid email is required'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
    body('consent').isBoolean().withMessage('Consent must be true or false')],
    userController.signUp
);

router.post('/login',
    [body('email').isEmail().withMessage('Valid email is required'),
    body('password').notEmpty().withMessage('Password is required')],
    userController.login
);

router.get('/profile/', authmiddleware, userController.getUserProfile);

router.put('/profile/', authmiddleware, userController.updateUserProfile);