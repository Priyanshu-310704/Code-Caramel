const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true
    },
    password: {
        type: String,
        required: false // Optional for Google OAuth users
    },
    name: {
        type: String,
        trim: true
    },
    picture: {
        type: String,
        default: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Felix'
    },
    gender: {
        type: String,
        enum: ['Male', 'Female', 'Prefer not to say', 'Other'],
        default: 'Prefer not to say'
    }
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
