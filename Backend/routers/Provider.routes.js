const express = require('express');
const router = express.Router();
const ProviderController = require('../Controllers/Provider.controller');
const authmiddleware = require('../middleware/auth.middleware');    
const {body} = require('express-validator');
router.post('/signup',
    [body('firstName').notEmpty().withMessage('First name is required'),
    body('lastName').notEmpty().withMessage('Last name is required'),
    body('email').isEmail().withMessage('Valid email is required'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long')],
    ProviderController.signUp
);

router.post('/login',
    [body('email').isEmail().withMessage('Valid email is required'),
    body('password').notEmpty().withMessage('Password is required')],
    ProviderController.login
);

router.get('/profile/', authmiddleware, ProviderController.getProviderProfile);
router.put('/profile/', authmiddleware, ProviderController.updateProviderProfile);

module.exports = router;

