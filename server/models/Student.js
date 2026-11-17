const mongoose = require("mongoose");

const studentSchema = new mongoose.Schema({
    fullName: {
        type: String,
        required: true
    },
    registrationNumber: {
        type: String,
        required: true,
        unique: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    course: {
        type: String,
        required: true
    },
    yearOfStudy: {
        type: Number,
        required: true
    },
    phone: {
        type: String,
        required: true
    }
}, { timestamps: true });

module.exports = mongoose.model("Student", studentSchema);