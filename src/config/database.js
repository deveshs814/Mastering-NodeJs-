const mongoose = require("mongoose");

const connectDB = async() =>{
    await mongoose.connect(
        //    "mongodb string"
    );
};
    
module.exports = connectDB; 