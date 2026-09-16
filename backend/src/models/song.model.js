const mongoose = require("mongoose");

const songSchema = new mongoose.Schema(
    {
        url: {
            type: String,
            required: true
        },

        posterurl: {
            type: String,
            default: null
        },

        title: {
            type: String,
            required: true
        },

        mood: {
            type: String,
            enum: {
                values: ["sad", "happy", "surprised"],
                message: "Invalid mood"
            },
            required: true
        }
    },
    {
        timestamps: true
    }
);

const songmodel = mongoose.model("song", songSchema);

module.exports = songmodel;