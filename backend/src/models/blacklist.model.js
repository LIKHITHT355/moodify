const mongoose = require("mongoose");
const blacklistSchema = new mongoose.Schema({
    token:{
        type:String,
        required:[true,"token is required"],
    }
},
{
        timestamps:true
    })
const blacklistmodel = mongoose.model("blacklist",blacklistSchema)
module.exports =blacklistmodel
