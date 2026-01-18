const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcrypt');
const MedicalRecord = require('./medicalRecord.model');
const { v4: uuidv4 } = require('uuid');
const UserSchema = new Schema({
    Name:{
        firstName:{
            type: String,
            required: true
        },
        lastName:{
            type: String,
        },
    },
    age:{
        type: Number,
        required: true,
    },
    gender:{
        type: String,
        required: true,
    },
    allergies:{
        type: [MedicalRecord.schema],
    },
    email:{
        type: String,
        required: true,
        unique: true,
    },
    password:{
        type: String,
        required: true,
    },
    consent:{
        type: Boolean,
        required: true,
    },
    _id:{
        type: String,
        default: uuidv4
    },
    goals:{
        steps:{
            type: Number,
        },
        Goalsteps:{
            type: Number,
        },
        sleepHours:{
            type: Number,
        },
        GoalSleepHours:{
            type: Number,
        },
        WaterIntake:{
            type: Number,
        },
        GoalWaterIntake:{
            type: Number,
        }
    }
    
}, { timestamps: true });


const User = mongoose.model('User', UserSchema);

module.exports = User;