const {User}=require('../Models/user.model');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const BlackList = require('../Models/blackList.model');

exports.signUp = async (req, res) => {
    try {
        const { firstName, lastName, email, password, consent } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);   
        const newUser = new User({
            Name: {
                firstName,
                lastName
            },
            email,
            password: hashedPassword,
            consent
        });
        await newUser.save();
        
        // Generate JWT token
        const token = jwt.sign(
            { id: newUser._id, email: newUser.email, role: 'user' },
            process.env.JWT_SECRET || 'your-secret-key',
            { expiresIn: '24h' }
        );
        
        // Set cookie
        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            maxAge: 24 * 60 * 60 * 1000 // 24 hours
        });
        
        res.status(201).json({ message: 'User registered successfully', token });
    }
    catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: 'Invalid email or password' });
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid email or password' });
        }
        
        // Generate JWT token
        const token = jwt.sign(
            { id: user._id, email: user.email, role: 'user' },
            process.env.JWT_SECRET || 'your-secret-key',
            { expiresIn: '24h' }
        );
        
        // Set cookie
        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            maxAge: 24 * 60 * 60 * 1000 // 24 hours
        });
        
        res.status(200).json({ message: 'Login successful', token });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

exports.getUserProfile = async (req, res) => {
    try {
        const userId = req.params.id;
        const user = await User.findById(userId).select('-password');
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

exports.updateUserProfile = async (req, res) => {
    try {
        const userId = req.params.id;
        const updates = req.body;
        const user = await User.findByIdAndUpdate(userId, updates, { new: true }).select('-password');
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};


exports.deleteUser = async (req, res) => {
    try {
        const userId = req.params.id;
        const user = await User.findByIdAndDelete(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json({ message: 'User deleted successfully' });
    }
    catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

exports.logout = async (req, res) => {
    try {
        const token = req.cookies.token || req.headers.authorization?.split(' ')[1];
        
        if (token) {
            // Add token to blacklist
            await BlackList.create({ token });
        }
        
        // Clear cookie
        res.clearCookie('token', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production'
        });
        
        res.status(200).json({ message: 'Logout successful' });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};
