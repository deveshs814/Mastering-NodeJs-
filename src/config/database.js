const mongoose = require("mongoose");

const connectDB = async() =>{
    await mongoose.connect(
        //   "Mongodb string"
    );
};
    
module.exports = connectDB; 