const mongoose =require("mongoose")

const blackListtoken =new mongoose.Schema({
    token: {
        type: String,
        required: [true, "token is required for blacklisting"]
    }
},
{
    timestamps:true
})

const tokenblacklistModel =mongoose.model("blacklistToken", blackListtoken)

module.exports =tokenblacklistModel;