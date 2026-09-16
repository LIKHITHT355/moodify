const mongoose = require("mongoose");
function ctb(){
    mongoose.connect(process.env.mongouri)
    .then(()=>{
        console.log("connected to db")
    })
    .catch(err =>{
        console.log("error in connecting ",err)
    })
}
module.exports =ctb