const mongoose = require("mongoose");

const connectDB = async() =>{
    await mongoose.connect(
      "mongodb+srv://shukladevesh9814:mahadev123@devtinder1.hvulopz.mongodb.net/devtinder1"
    );
};

module.exports = connectDB;

