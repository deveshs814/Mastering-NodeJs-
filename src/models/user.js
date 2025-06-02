const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt  = require("bcrypt");
const userSchema = new mongoose.Schema({
    firstName:{
        type: String,
        minLength:6,
        maxLength:20,
        required: true
    },
    lastName:{
        type: String,
    },
    emailId:{
        type: String,
        lowercase:true,
        unique:true,
        trim:true,
        required: true,
        validate(value){
            if(!validator.isEmail(value)){
            throw new Error("Invalid Email address: " + value);
        }
        },
    },
    password:{
        type:String,
        required: true
    },
    age:{
        type: Number,
        min:18
    },
    gender:{
        type:String,
        validate(value){ //validation is checked before the saving into db..will save only if validation is okay.
            if(!["male","female","others"].includes(value)){
                throw new Error("Gender is not valid");
            }
        },
    },
    about:{
        type:String,
        default:"This is a default about of user" //this will be the default value of about if not passed by user.
    },
    skills:{
        type:[String],
    }
},{
    timestamps:true, //this will give the created at and updated at.
});

userSchema.methods.getJWT = async function() {
    const user = this;
//here 'this' is referring to that user.
    const token = await jwt.sign({_id:user._id},"DEV@Tinder@123",{expiresIn:"7d"})
    //offloaded this task of jwt token generation to schema methods. 
    return token;
};
userSchema.methods.validatePassword = async function(passwordInputByUser) {
    const user = this;
    const passwordHash = user.password;

    const isPasswordValid = await bcrypt.compare(
        passwordInputByUser,
        passwordHash
    );
    return isPasswordValid;
} 


module.exports = mongoose.model("User", userSchema);