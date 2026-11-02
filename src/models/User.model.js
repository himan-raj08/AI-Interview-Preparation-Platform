const mongoose =require("mongoose")

const userSchema =new mongoose.Schema({
    userName: {
        type: String,
        unique: [true, "Username exists already"],
        required: true
    },
    email: {
        type: String,
        unique: [true, "Account exists already"],
        required: true
    },
    password: {
        type: String,
        required: true
    }
})

const userModel =mongoose.model("users", userSchema
);

module.exports =userModel;