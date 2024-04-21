const ingrCntrlr = require("../controllers/ingridients.controller");
const { checkToken } = require("../middleware/checkToken");
const { verifySignUp } = require("../middleware/verifySignUp");
const { multerUpload } = require("../middleware/multer");
const { checkExistingItem } = require("../middleware/checkExistingItem");
const multer = require("multer");

module.exports = function (app) {
  app.post(
    "/api/ingridients",
    function (req, res) {
      multerUpload("ingridients", {
        tableName: "ingridients",
        field: "title",
      }).any()(req, res, function (err) {
        if (err instanceof multer.MulterError) {
          return res.status(400).send({
            message: `Запись с именем уже существует`,
          });
        } else {
          return res.status(400).send({
            message: `Запись с именем уже существует ххехехехе`,
          });
        }
      });
    },
    ingrCntrlr.create
  );
  app.post("/api/ingridients/filter", ingrCntrlr.getAllFilter);

  app.get("/api/ingridients/:id", ingrCntrlr.getById);

  app.get("/api/ingridients", ingrCntrlr.getAll);

  app.get("/api/ingridients/:id/recipes", ingrCntrlr.getAllRecipes);

  app.patch(
    "/api/ingridients/:id",
    multerUpload("ingridients").any(),
    ingrCntrlr.update
  );

  app.post(
    "/api/ingridients/:id/images",
    multerUpload("ingridients").single("file"),
    ingrCntrlr.uploadImage
  );

  // app.post(
  //     "/api/ingridients",
  //     multerUpload("ingridients").single("file"),
  //     ingrCntrlr.create
  // );

  app.delete("/api/ingridients/:id", ingrCntrlr.delete);
};
