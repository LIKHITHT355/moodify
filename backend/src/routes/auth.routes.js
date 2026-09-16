const express = require("express");
const authmiddleware =require("../middleware/auth.middleware")
const authcontroller = require("../controllers/auth.controller")
const router = express.Router();
router.post('/register',authcontroller.registerUser)
router.post('/login',authcontroller.loginUser)
router.get('/getme',authmiddleware.optionalAuthuser,authcontroller.getme)
router.post('/logout',authcontroller.logoutUser)
module.exports=router
