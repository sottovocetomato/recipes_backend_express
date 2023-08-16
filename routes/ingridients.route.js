const ingrCntrlr = require("../controllers/ingridients.controller");
const { checkToken } = require("../middleware/checkToken");
const { verifySignUp } = require("../middleware/verifySignUp");
const { multerUpload } = require("../middleware/multer");

module.exports = function (app) {
  app.post("/api/ingridients", ingrCntrlr.create);
  app.post("/api/ingridients/filter", ingrCntrlr.getAllFilter);

  app.get("/api/ingridients/:id", ingrCntrlr.getById);

  app.get("/api/ingridients", ingrCntrlr.getAll);

  app.patch("/api/ingridients/:id", ingrCntrlr.update);

  app.post(
    "/api/ingridients/images/:id",
    multerUpload('ingridients').single("file"),
    ingrCntrlr.uploadImage
  );

  app.delete("/api/ingridients/:id", ingrCntrlr.delete);
};
