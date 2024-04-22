const multer = require("multer");
const path = require("path");
const { checkItemExistsHelper } = require("../helpers/main");
const db = require("../config/db.config");

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
const checkExistBeforeUpload = async (
  req,
  file,
  cb,
  { tableName, field } = {}
) => {
  const Table = db[tableName];
  const entry = await Table.findOne({
    where: {
      [field]: req.body[field],
    },
  });
  console.log(entry);
  if (!entry) {
    return cb(null, true);
  } else {
    cb(new Error(`Запись с именем ${req.body[field]} уже существует`));
  }
};

const storageEngine = (filePath) =>
  multer.diskStorage({
    destination: `./static/images/${filePath}`,
    filename: (req, file, cb) => {
      cb(null, `${Date.now()}-${file.originalname}`);
    },
  });

exports.multerUpload =
  (filePath, multerMethod, checkExistenceData = {}) =>
  (req, res, next) => {
    const { method, methodArgs } = multerMethod;
    console.log(method);
    const upload = multer({
      storage: storageEngine(filePath),
      limits: { fileSize: 10000000 },
      fileFilter: async (req, file, cb) => {
        checkFileType(file, cb);
        if (checkExistenceData?.tableName && checkExistenceData?.field) {
          await checkExistBeforeUpload(req, file, cb, checkExistenceData);
        }
      },
    })[method](methodArgs);
    console.log(upload);
    upload(req, res, function (err) {
      try {
        if (!err) return next();
        if (err instanceof multer.MulterError) {
          return res.status(400).send({
            message: `Запись с именем уже существует`,
          });
        } else {
          return res.status(400).send({
            message: `Запись с именем уже существует ххехехехе`,
          });
        }
      } catch (e) {
        return next(err);
      }
    });
  };
