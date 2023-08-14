const db = require("../config/db.config.js");
exports.uploadSingle = (req, res) => {
    if (req.file) {
        res.send("Single file uploaded successfully");
    } else {
        res.status(400).send("Please upload a valid image");
    }
};