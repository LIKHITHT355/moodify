const express = require("express");
const cookieparser = require("cookie-parser")
const cors = require("cors")
const app = express();
const authroutes = require("./routes/auth.routes")
app.use(express.json())
app.use(cookieparser())
app.use(cors({
    origin:"http://localhost:5173",
    credentials:true
}))
const songroutes = require("./routes/song.route")
app.use("/api/auth",authroutes)
app.use("/api/song",songroutes)
app.use((err, req, res, next) => {
    if (err?.name === "MulterError") {
        return res.status(400).json({ message: err.message });
    }

    console.error("UNHANDLED ERROR:", err);
    return res.status(500).json({ message: "Internal server error" });
})
module.exports =app
