const {Provider}=require('../Models/Provider.model');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const BlackList = require('../Models/blackList.model');

exports.signUp = async (req, res) => {
    try {
        const { firstName, lastName, email, password } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);
        const newProvider = new Provider({
            name: {
                firstName,
                lastName
            },
            email,
            password: hashedPassword
        });
        await newProvider.save();
        
        // Generate JWT token
        const token = jwt.sign(
            { id: newProvider._id, email: newProvider.email, role: 'provider' },
            process.env.JWT_SECRET || 'your-secret-key',
            { expiresIn: '24h' }
        );
        
        // Set cookie
        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            maxAge: 24 * 60 * 60 * 1000 // 24 hours
        });
        
        res.status(201).json({ message: 'Provider registered successfully', token });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const provider = await Provider.findOne({ email });
        if (!provider) {
            return res.status(400).json({ message: 'Invalid email or password' });
        }
        const isMatch = await bcrypt.compare(password, provider.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid email or password' });
        }
        
        // Generate JWT token
        const token = jwt.sign(
            { id: provider._id, email: provider.email, role: 'provider' },
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

exports.getProviderProfile = async (req, res) => {
    try {
        const providerId = req.params.id;
        const provider = await Provider.findById(providerId).select('-password');
        if (!provider) {
            return res.status(404).json({ message: 'Provider not found' });
        }
        res.status(200).json(provider);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

exports.updateProviderProfile = async (req, res) => {
    try {
        const providerId = req.params.id;
        const updates = req.body;
        const provider = await Provider.findByIdAndUpdate(providerId, updates, { new: true }).select('-password');
        if (!provider) {
            return res.status(404).json({ message: 'Provider not found' });
        }
        res.status(200).json(provider);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

exports.deleteProvider = async (req, res) => {
    try {
        const providerId = req.params.id;
        const provider = await Provider.findByIdAndDelete(providerId);
        if (!provider) {
            return res.status(404).json({ message: 'Provider not found' });
        }
        res.status(200).json({ message: 'Provider deleted successfully' });
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

