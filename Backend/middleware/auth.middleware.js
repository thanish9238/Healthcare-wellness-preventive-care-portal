const {User} = require('../Models/user.model');
const jwt = require('jsonwebtoken');
const {Provider} = require('../Models/Provider.model');

exports.authenticateUser = async (req, res, next) => {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    if (!token) {
        return res.status(401).json({ message: 'No token provided' });
    }
    try {
        const decoded = jwt.verify(token, 'your_jwt_secret');
        const user = await User.findById(decoded.id);
        if (!user) {
            return res.status(401).json({ message: 'Invalid token' });
        }
        req.user = user;
        next();
    }
    catch (error) {
        res.status(401).json({ message: 'Invalid token', error: error.message });
    }
};

exports.authenticateProvider = async (req, res, next) => {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    if (!token) {
        return res.status(401).json({ message: 'No token provided' });
    }
    try {
        const decoded = jwt.verify(token, 'your_jwt_secret');
        const provider = await Provider.findById(decoded.id);
        if (!provider) {
            return res.status(401).json({ message: 'Invalid token' });
        }
        req.provider = provider;
        next();
    }
    catch (error) {
        res.status(401).json({ message: 'Invalid token', error: error.message });
    }
};
