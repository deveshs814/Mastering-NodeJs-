const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
    firstName:{
        type: String
    },
    lastName:{
        type: String
    },
    emialId:{
        type: String
    },
    password:{
        type:String
    },
    age:{
        type: Number
    },
    gender:{
        type:String
    }
});

const User = mongoose.model("User",userSchema);

module.exports = User;