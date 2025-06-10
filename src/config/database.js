const mongoose = require("mongoose");

const connectDB = async() =>{
    await mongoose.connect(
            // "connection string"
    );
};
    
module.exports = connectDB; 