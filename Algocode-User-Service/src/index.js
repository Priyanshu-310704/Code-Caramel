const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/dbConfig');
const { connectRedis } = require('./config/redisConfig');
const authRoutes = require('./routes/authRoutes');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3004;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/v1/user/auth', authRoutes);

// Database & Redis Connections
const startServer = async () => {
    try {
        await connectDB();
        await connectRedis();
        
        app.listen(PORT, () => {
            console.log(`Algocode-User-Service running on port ${PORT}`);
        });
    } catch (error) {
        console.error('Failed to start server:', error);
        process.exit(1);
    }
};

startServer();
