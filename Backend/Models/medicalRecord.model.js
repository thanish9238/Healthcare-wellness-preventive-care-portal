const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const MedicalRecordSchema = new Schema({
    allergy:{
        type: String,
        required: true,
    },
    medication:{
        type: String,
        required: true,
    }
}, { timestamps: true });

const MedicalRecord = mongoose.model('MedicalRecord', MedicalRecordSchema);

module.exports = MedicalRecord;