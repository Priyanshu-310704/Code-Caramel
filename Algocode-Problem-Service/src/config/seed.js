const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../../.env') }); 

const Problem = require('../models/problem.model');
const seedData = require('./data.json');

async function seedDatabase() {
    try {
        const dbUrl = process.env.ATLAS_DB_URL;
        if (!dbUrl) throw new Error("ATLAS_DB_URL not found in .env");

        await mongoose.connect(dbUrl);
        console.log("Connected to DB, starting seed...");

        await Problem.deleteMany({});
        console.log("Cleared existing problems.");

        await Problem.insertMany(seedData);
        console.log("Successfully seeded database with", seedData.length, "problems.");

        process.exit(0);
    } catch (error) {
        console.error("Error during seeding:", error);
        process.exit(1);
    }
}

seedDatabase();
