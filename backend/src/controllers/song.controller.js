const songmodel = require('../models/song.model');
const storageservice = require("../services/storage.service");
const id3 = require('node-id3');

async function uploadSong(req, res) {

    try {
        if (!req.file) {
            return res.status(400).json({
                message: "No song file uploaded"
            });
        }

        const songbuffer = req.file.buffer;
        const mood = String(req.body.mood || '').trim().toLowerCase();

        if (!['sad', 'happy', 'surprised'].includes(mood)) {
            return res.status(400).json({ message: "mood must be sad, happy, or surprised" });
        }

        if (!req.file.mimetype.startsWith('audio/')) {
            return res.status(400).json({ message: "Uploaded file must be audio" });
        }

        const tags = id3.read(songbuffer);

        // Get title from ID3 or filename
        const title =
            tags.title ||
            req.file.originalname.replace(/\.[^/.]+$/, "");

        

        // Upload song
        const songfile = await storageservice.uploadfile({
            buffer: songbuffer,
            fileName: title + ".mp3",
            folder: "/chort-2/moddify/songs"
        });

        console.log("SONG UPLOADED:", songfile.url);

        // Poster is optional
        let posterurl = null;

        if (tags.image && tags.image.imageBuffer) {

            const postfile = await storageservice.uploadfile({
                buffer: tags.image.imageBuffer,
                fileName: title + ".jpeg",
                folder: "/chort-2/moddify/posters"
            });

            posterurl = postfile.url;

            console.log("POSTER UPLOADED:", posterurl);

        } else {

            console.log("No embedded album artwork found");
        }

        // Save to MongoDB
        const song = await songmodel.create({
            title: title,
            url: songfile.url,
            posterurl: posterurl,
            mood
        });

        return res.status(201).json({
            message: "Song created successfully",
            song
        });

    } catch (error) {

        console.error("UPLOAD SONG ERROR:", error);

        return res.status(500).json({
            message: "Song upload failed",
            error: error.message
        });
    }
}
async function getsong(req,res){
    try {
        const mood = String(req.query.mood || '').trim().toLowerCase();
        const validMoods = ["sad", "happy", "surprised"];

        if (!validMoods.includes(mood)) {
            return res.status(400).json({ message: "mood must be sad, happy, or surprised" });
        }

        const song = await songmodel.findOne({ mood });

        if (!song) {
            return res.status(404).json({ message: "No song found for this mood" });
        }

        return res.status(200).json({
            message:"song fetched successfully",
            song
        });
    } catch (error) {
        console.error("GET SONG ERROR:", error);
        return res.status(500).json({ message: "Unable to fetch song" });
    }
}

module.exports = { uploadSong ,getsong};
