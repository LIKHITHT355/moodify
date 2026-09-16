const mongoose = require("mongoose")

const userschema = new mongoose.Schema({
    username:{
        type:String,
        required:[true,"username is required"],
        unique:[true,"username must be unique"]
    },
    email:{
        type:String,
        required:[true],
        unique:[true,"email must be unique"],
    },
    password:{
        type:String,
        required:[true],
        select:false

    }
})

const usermodel =mongoose.model("users",userschema)
module.exports =usermodel
