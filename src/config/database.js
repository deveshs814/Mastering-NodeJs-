const mongoose = require("mongoose");

const connectDB = async() =>{
    await mongoose.connect(
        //   "mongodb connection string"
    );
};
    
module.exports = connectDB; 