const User = require('../models/User');

exports.getProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user.sub).select('-password');
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        return res.status(200).json(user);
    } catch (error) {
        console.error('Get Profile Error:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
};

exports.updateProfile = async (req, res) => {
    try {
        const { name, gender } = req.body;
        
        const user = await User.findById(req.user.sub);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        if (name !== undefined) user.name = name;
        if (gender !== undefined) user.gender = gender;

        await user.save();

        return res.status(200).json({
            message: 'Profile updated successfully',
            user: {
                sub: user._id.toString(),
                name: user.name,
                email: user.email,
                picture: user.picture,
                gender: user.gender
            }
        });
    } catch (error) {
        console.error('Update Profile Error:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
};

exports.getUsersBulk = async (req, res) => {
    try {
        const { userIds } = req.body;
        if (!userIds || !Array.isArray(userIds)) {
            return res.status(400).json({ error: 'userIds array is required' });
        }

        const mongoose = require('mongoose');
        const validUserIds = userIds.filter(id => id && mongoose.isValidObjectId(id));
        
        console.log("Fetching bulk users for IDs:", validUserIds);

        const users = await User.find({ _id: { $in: validUserIds } }).select('name picture email gender');
        
        // Map to object for O(1) lookup on the frontend
        const usersMap = {};
        users.forEach(user => {
            usersMap[user._id.toString()] = user;
        });

        return res.status(200).json(usersMap);
    } catch (error) {
        console.error('Get Users Bulk Error:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
};
