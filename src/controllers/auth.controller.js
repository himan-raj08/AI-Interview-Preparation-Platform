const userModel =require("../models/User.model")
const jwt =require("jsonwebtoken")
const bcrypt =require("bcryptjs")
const tokenblacklistModel =require("../models/blackList.model")



async function registerController(req,res) {
  const { userName, email, password} =req.body;

  if(!userName || !email || !password){
    return res.status(400).json({
        message: "Please provide username, email, password"
    })

  }
  const isUserAlreadyExists =await userModel.findOne({
    $or: [ {userName}, {email}]
  })
  if(isUserAlreadyExists) {
       return res.status(400).json({
        message: "Account already exists with this email  address"
    })
  }

  const hash =await bcrypt.hash(password, 10);
    const user =await userModel.create({
        userName,
        email,
        password: hash
    })

    const token =jwt.sign(
        { id:user._id, userName: user.userName},
        process.env.JWT_SECRET,
        {expiresIn: "1d"}
    )
  res.cookie("token", token, {
    httpOnly: true,
    secure: false,
    sameSite: "lax",
    maxAge: 24 * 60 * 60 * 1000
});

    res.status(201).json({
        message: "User registered successfully",
        user: {
            id:user._id,
            userName:user.userName,
            email: user.email
        },
        token
    })
}

async function loginuserController(req, res) {
 const { email, password} =req.body;

 const user =await userModel.findOne({ email})

if(!user) {
      return res.status(400).json({
        message: "Invalid email address"
    })
}
const isPasswordValid =await bcrypt.compare(password,user.password);
if(!isPasswordValid){
      return res.status(400).json({
        message: "Invalid password, emailid"
    })
}
  const token =jwt.sign(
        { id:user._id, userName: user.userName},
        process.env.JWT_SECRET,
        {expiresIn: "1d"}
    )
  res.cookie("token", token, {
    httpOnly: true,
    secure: false,
    sameSite: "lax",
    maxAge: 24 * 60 * 60 * 1000
});
   
    return res.status(200).json({
        message: "User logged in Successfully",
        user :{
       id: user._id,
       userName: user.userName,
        email:user.email
        },
        token
    })
}

async function logoutUserController(req, res) {
    const token =req.cookies.token

    if(token){
       await tokenblacklistModel.create({ token })
        
    }
    res.clearCookie("token");
    res.status(200).json({
        message: "User logged out Successfully"
    })
    
}

async function getMeController(req, res) {

    const user =await userModel.findById(req.user.id);
    res.status(200).json({
        message: "Details fetched Successfully",
        user : {
            id: user._id,
            userName: user.userName,
            email: user.email
        }
    })
    
}
module.exports={
    registerController,
    loginuserController,
    logoutUserController,
    getMeController
}