const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const { redisClient } = require('../config/redisConfig');
const sendOTP = require('../utils/mailer');

const generateOTP = () => {
    return Math.floor(100000 + Math.random() * 900000).toString(); // 6 digits
};

exports.signup = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        if (!name || !email || !password) return res.status(400).json({ error: 'Name, email, and password are required' });

        const existingUser = await User.findOne({ email });
        if (existingUser) return res.status(400).json({ error: 'User already exists' });

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        await User.create({
            email,
            password: hashedPassword,
            name,
            picture: `https://api.dicebear.com/7.x/avataaars/svg?seed=${email}`
        });

        return res.status(201).json({ message: 'User created successfully. You can now login.' });
    } catch (error) {
        console.error('Signup Error:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
};

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) return res.status(400).json({ error: 'Email and password are required' });

        const user = await User.findOne({ email });
        if (!user || (!user.password && user.password !== "")) return res.status(401).json({ error: 'Invalid email or password' });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(401).json({ error: 'Invalid email or password' });

        // Password matches, skip OTP and login directly
        const payload = {
            sub: user._id.toString(),
            name: user.name,
            email: user.email,
            picture: user.picture,
            gender: user.gender
        };

        const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '7d' });

        return res.status(200).json({ message: 'Login successful', token, user: payload });
    } catch (error) {
        console.error('Login Error:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
};

exports.sendOtp = async (req, res) => {
    // Keeping this for general testing, but not actively used in the new flow
    try {
        const { email } = req.body;
        if (!email) return res.status(400).json({ error: 'Email is required' });

        const otp = generateOTP();
        await redisClient.setEx(`otp:${email}`, 300, otp);
        
        const isSent = await sendOTP(email, otp);
        if (!isSent) {
            return res.status(500).json({ error: 'Failed to send OTP email' });
        }

        return res.status(200).json({ message: 'OTP sent successfully' });
    } catch (error) {
        console.error('Send OTP Error:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
};

exports.verifyOtp = async (req, res) => {
    try {
        const { email, otp } = req.body;
        if (!email || !otp) return res.status(400).json({ error: 'Email and OTP are required' });

        const storedOtp = await redisClient.get(`otp:${email}`);
        if (!storedOtp || storedOtp !== otp) {
            return res.status(401).json({ error: 'Invalid or expired OTP' });
        }

        // OTP is valid, clear it
        await redisClient.del(`otp:${email}`);

        // Find user
        let user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ error: 'User not found. Please sign up first.' });
        }

        // Generate custom JWT containing the exact same shape as the Google JWT so frontend handles it interchangeably
        const payload = {
            sub: user._id.toString(),
            name: user.name,
            email: user.email,
            picture: user.picture,
            gender: user.gender
        };

        const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '7d' });

        return res.status(200).json({ message: 'Login successful', token, user: payload });
    } catch (error) {
        console.error('Verify OTP Error:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
};
