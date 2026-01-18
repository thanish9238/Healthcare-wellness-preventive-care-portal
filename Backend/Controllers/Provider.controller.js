const {Provider}=require('../Models/Provider.model');
const bcrypt = require('bcrypt');

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
        res.status(201).json({ message: 'Provider registered successfully' });
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
        res.status(200).json({ message: 'Login successful' });
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

