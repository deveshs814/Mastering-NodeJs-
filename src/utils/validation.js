const validator  = require("validator");

const validateSignupData = (req) =>{
    const{ firstName,lastName,emailId,password } = req.body;
    if(!firstName || !lastName){
        throw new Error("Name is not valid");
    }else if(!validator.isEmail(emailId)){
        throw new Error("Email is not valid");
    }else if(!validator.isStrongPassword(password)){
        throw new Error("Please give a strong password");
}
};
function validateEditProfileData(req) {
  const allowedEditFields = ["firstName", "lastName", "gender", "skills", "about"];
  return Object.keys(req.body).every((field) => allowedEditFields.includes(field));
}   

module.exports = {
    validateSignupData,validateEditProfileData
}