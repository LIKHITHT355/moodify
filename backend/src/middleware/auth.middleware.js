const usermodel = require("../models/user.model")
const jwt =require("jsonwebtoken")
const redis = require("../config/cache")
async function authuser(req,res,next){
    const token =req.cookies.token
    if(!token){
        return res.status(401).json({
            message:"not authorized, no token"
        })
    }

    try{
        const isblacklisted = await redis.get(token)
        if (isblacklisted){
            return res.status(401).json({
                message:"not authorized, token blacklisted"
            })
        }

        const decoded = jwt.verify(
        token,
        process.env.jwt,
    )

    req.user = decoded
    next()
    }
    catch(err){
        if (err?.name !== "JsonWebTokenError" && err?.name !== "TokenExpiredError") {
            console.error("AUTH ERROR:", err)
            return res.status(503).json({ message:"authorization service unavailable" })
        }
        return res.status(401).json({
            message:"not authorized, token failed"
        })
    }
    

}

async function optionalAuthuser(req, res, next) {
    const token = req.cookies.token;
    if (!token) return next();

    try {
        const isblacklisted = await redis.get(token);
        if (isblacklisted) return next();

        req.user = jwt.verify(token, process.env.jwt);
        return next();
    } catch (err) {
        if (err?.name !== "JsonWebTokenError" && err?.name !== "TokenExpiredError") {
            console.error("OPTIONAL AUTH ERROR:", err);
            return res.status(503).json({ message: "authorization service unavailable" });
        }

        return next();
    }
}

module.exports = {authuser, optionalAuthuser}



