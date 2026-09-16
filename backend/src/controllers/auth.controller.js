const usermodel = require("../models/user.model")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
const redis = require("../config/cache")
async function registerUser(req,res){
    const username = String(req.body.username || '').trim();
    const email = String(req.body.email || '').trim().toLowerCase();
    const password = String(req.body.password || '').trim();

    if (!username || !email || !password) {
        return res.status(400).json({ message: "username, email and password are required" })
    }

    if (!/^\S+@\S+\.\S+$/.test(email)) {
        return res.status(400).json({ message: "Enter a valid email address", field: "email" })
    }

    if (username.length < 2) {
        return res.status(400).json({ message: "Username must contain at least 2 characters", field: "username" })
    }

    if (password.length < 8) {
        return res.status(400).json({ message: "Password must contain at least 8 characters", field: "password" })
    }

    const isalredyregistered = await usermodel.findOne({
        $or:[
            { email: email },
            { username: { $regex: new RegExp(`^${username.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}$`, 'i') } }
        ]
    })

    if (isalredyregistered){
        const duplicateField = isalredyregistered.email === email ? "email" : "username";
        return res.status(409).json({
            message: `This ${duplicateField} is already registered. Please log in or use another ${duplicateField}.`,
            code: "DUPLICATE_USER",
            field: duplicateField
        })
    }
    const hash =await bcrypt.hash(password,10);
    const user = await usermodel.create({
        username,
        email,
        password:hash
    })
    return res.status(201).json({
        message:"user registered successfully",
        user:{
            id:user._id,
            username,
            email
        }
    })




}

async function loginUser(req,res){
    const email = String(req.body.email || '').trim().toLowerCase();
    const username = String(req.body.username || '').trim();
    const password = String(req.body.password || '');

    if (!password || (!email && !username)) {
        return res.status(400).json({message:"email or username and password are required"})
    }
    const user = await usermodel.findOne({
        $or:[
            {email},{username}
        ]
    }).select("+password")
    if (!user){
        return res.status(400).json({message:"invalid credntial"})
    }

    const ispasswordmatch = await bcrypt.compare(password,user.password)

    if(!ispasswordmatch){
        return res.status(400).json({
            message:"invalid credential"
        })
    }
    const token = jwt.sign({
        id:user._id,
        username:user.username
    },
    process.env.jwt,{expiresIn:"3d"}
)
res.cookie("token",token)

return res.status(200).json({
    message:"user logged in successfully",
    user:{
        id:user._id,
        username:user.username,
        email:user.email
    }
})

}
async function getme(req,res){
    if (!req.user) {
        return res.status(200).json({
            message: "no active session",
            user: null
        })
    }

    const user = await usermodel.findById(req.user.id)
    return res.status(200).json({
        message:"user fetched successfully",
        user
    }) 

}

async function logoutUser(req,res){
    const token = req.cookies.token
    try {
        if (token) {
            await redis.set(token,Date.now().toString(),"EX",60*60*24)
        }
    } catch (error) {
        console.error("LOGOUT ERROR:", error)
        return res.status(503).json({ message: "Unable to log out safely" })
    }

    res.clearCookie("token")
    return res.status(200).json({
        message:"user logged out successfully"
    })
}

module.exports={registerUser,loginUser,getme,logoutUser}
