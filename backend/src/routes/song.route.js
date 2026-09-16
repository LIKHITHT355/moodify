const express = require('express');
const router = express.Router();
const songcontroller = require('../controllers/song.controller');
const upload = require('../middleware/upload.middleware');
router.post("/",upload.single('file'),songcontroller.uploadSong)
router.get("/",songcontroller.getsong)
module.exports = router;