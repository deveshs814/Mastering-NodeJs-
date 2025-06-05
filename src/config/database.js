const mongoose = require("mongoose");

const connectDB = async() =>{
    await mongoose.connect(
        //  "mongdb connection string "
    );
};
    
module.exports = connectDB; 