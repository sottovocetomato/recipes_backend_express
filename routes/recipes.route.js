const recipeCntrlr = require("../controllers/recipe.controller");
const { checkToken } = require("../middleware/checkToken");
const { verifySignUp } = require("../middleware/verifySignUp");
const { multerUpload } = require("../middleware/multer");

module.exports = function (app) {
  app.post("/api/recipes",  multerUpload("recipes").any(), recipeCntrlr.create);
  app.get("/api/recipes/:id", recipeCntrlr.getById);
  app.get("/api/recipes", recipeCntrlr.getAll);
  app.patch("/api/recipes/:id", recipeCntrlr.update);
  app.delete("/api/recipes/:id", recipeCntrlr.delete);

  app.post(
    "/api/recipes/:id/images",
    multerUpload("recipes").single("file"),
    recipeCntrlr.uploadImageById
  );

  app.post(
    "/api/recipes/images",
    multerUpload("recipes").single("file"),
    recipeCntrlr.uploadImage
  );
};
