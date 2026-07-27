const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../models/listing.js");
require('dotenv').config({ path: '../.env' }); // Load .env from parent directory

const dbUrl = process.env.ATLASDB_URL || "mongodb://127.0.0.1:27017/wanderlust";
const userOwnerId = "6a6522858fcca5b9d3ee6aff"; // your user ID (ayan99)

main()
.then(() => {
    console.log("connected to db");
    initDB();
})
.catch((err) => {
    console.log(err);
});

async function main() {
    await mongoose.connect(dbUrl);
}

const initDB = async () => {
    try {
        await Listing.deleteMany({}); // clear all data first
        initData.data = initData.data.map((obj) => ({
            ...obj,
            owner: userOwnerId,
            geometry: {
                type: "Point",
                coordinates: [77.2090, 28.6139] // Default coordinates (Delhi)
            }
        }));
        await Listing.insertMany(initData.data);
        console.log("Data was initialized successfully");
    } catch (err) {
        console.error("Initialization error:", err);
    } finally {
        mongoose.disconnect();
    }
};
