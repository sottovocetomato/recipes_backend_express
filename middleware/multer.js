const multer = require("multer")
const path = require("path");

const checkFileType = function (file, cb) {
  console.log("checking file type");
  //Allowed file extensions
  const fileTypes = /jpeg|jpg|png|gif|svg/;
  console.log("checking file type");
  //check extension names
  const extName = fileTypes.test(path.extname(file.originalname).toLowerCase());

  const mimeType = fileTypes.test(file.mimetype);

  if (mimeType && extName) {
    return cb(null, true);
  } else {
    cb("Error: You can Only Upload Images!!");
  }
};

const storageEngine = (filePath) => multer.diskStorage({
  destination: `./static/images/${filePath}`,
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

exports.multerUpload = (filePath) => multer({
  storage: storageEngine(filePath),
  limits: { fileSize: 10000000 },
  fileFilter: (req, file, cb) => {
    checkFileType(file, cb);
  },
});
