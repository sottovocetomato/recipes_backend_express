const { multerUpload } = require("../middleware/multer");

module.exports = function (app) {
    app.post("/image/single", multerUpload.single("image"));
}