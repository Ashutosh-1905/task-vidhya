const mongoose = require("mongoose");

const db = async()=>{
    try {
        mongoose.connect(process.env.MONGODB_URI);
        console.log("database connection successfully");
    } catch (error) {
        console.log(`database connection error`, error);
        process.exit(1);
    }
};

module.exports = db;