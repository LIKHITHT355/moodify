require("dotenv").config()
const app = require("./src/app")

const ctb = require("./src/config/database")
ctb()
app.listen(3000,()=>{
    console.log("server is running in 3000 port number ")
})