const {UserSchema} = require('../Models/user.model');
const mongoose = require('mongoose');

module.export.createUser =async({
    firstName,
    lastName,
    email,
    password,
})=>{
    const User = mongoose.model('User', UserSchema);
    const newUser = new User({ 
        firstName,
        lastName,
        email,
        password,
    });
    await newUser.save();
    return newUser;
};

module.export.updateProfile = async(email)=>{
    const User = mongoose.model('User', UserSchema);
    const user = await User.findOneAndUpdate({ email }, { $set: { profileUpdated: true } }, { new: true });
    return user;
};

module.export.updategoals = async(email,goals)=>{
    const User = mongoose.model('User', UserSchema);
    const user = await User.findOneAndUpdate({ email }, { $set: { goals: goals } }, { new: true });
    return user;
};
