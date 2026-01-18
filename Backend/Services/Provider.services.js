const {ProviderSchema}  = require('../Models/Provider.model');
const mongoose = require('mongoose');

module.export.createProvider =async({
    firstName,
    lastName,
    email,
    password,
})=>{
    const Provider = mongoose.model('Provider', ProviderSchema);
    const newProvider = new Provider({
        firstName,
        lastName,
        email,
        password,
    });
    await newProvider.save();
    return newProvider;
};

module.export.updateProfile = async(email)=>{
    const Provider = mongoose.model('Provider', ProviderSchema);
    const provider = await Provider.findOneAndUpdate({ email }, { $set: { profileUpdated: true } }, { new: true });
    return provider;
};

module.export.addPatient = async(email,patientId)=>{
    const Provider = mongoose.model('Provider', ProviderSchema);
    const provider = await Provider.findOneAndUpdate({ email }, { $push: { patients: patientId } }, { new: true });
    return provider;
};

module.export.getPatients = async(email)=>{
    const Provider = mongoose.model('Provider', ProviderSchema);
    const provider = await Provider.findOne({ email }).populate('patients');
    return provider.patients;
};

