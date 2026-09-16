const imagekit = require("@imagekit/nodejs");

async function uploadfile({ buffer, fileName, folder = "" }) {

    if (!fileName) {
        throw new Error("fileName is missing");
    }

    const privateKey = process.env.IMAGEKIT_PRIVATE_KEY || process.env.imagekit_privatekey;
    if (!privateKey) {
        throw new Error("IMAGEKIT_PRIVATE_KEY is missing");
    }

    const client = new imagekit({ privateKey });
    const file = await client.files.upload({
        file: await imagekit.toFile(buffer, fileName),
        fileName,
        folder
    });

    return file;
}

module.exports = { uploadfile };
