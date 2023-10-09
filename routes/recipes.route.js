const recipeCntrlr = require("../controllers/recipe.controller");
const recipeComment = require("../controllers/recipe_comment.controller");
const { checkToken } = require("../middleware/checkToken");
const { verifySignUp } = require("../middleware/verifySignUp");
const { multerUpload } = require("../middleware/multer");
const multer = require("multer");

const upload = multer();

module.exports = function (app) {
  app.post(
    "/api/recipes",
    [checkToken, multerUpload("recipes").any()],
    recipeCntrlr.create
  );
  app.post("/api/recipes/filter", recipeCntrlr.getAllFilter);
  app.post("/api/recipes/bytitle", recipeCntrlr.getAllByTitleSQL);

  app.post("/api/recipes/favorite/add", recipeCntrlr.addFavoriteRecipe);
  app.post("/api/recipes/favorite", recipeCntrlr.getFavoriteRecipe);
  app.post("/api/recipes/favorite/all", recipeCntrlr.getAllFavoriteRecipes);

  app.post("/api/recipes/like/add", recipeCntrlr.addToLikes);

  app.get("/api/recipes/:id", recipeCntrlr.getById);
  app.get("/api/recipes/user/:userId", checkToken, recipeCntrlr.getAllByUser);

  app.get("/api/recipes", recipeCntrlr.getAll);
  app.patch(
    "/api/recipes/:id",
    [checkToken, multerUpload("recipes").any()],
    recipeCntrlr.update
  );
  app.delete("/api/recipes/:id", checkToken, recipeCntrlr.delete);

  app.post(
    "/api/recipes/:id/images",
    [checkToken, multerUpload("recipes").single("file")],
    recipeCntrlr.uploadImageById
  );

  app.post(
    "/api/recipes/images",
    [checkToken, multerUpload("recipes").single("file")],
    recipeCntrlr.uploadImage
  );

  app.post(
    "/api/recipes/:id/comment/add",
    checkToken,
    recipeComment.addRecipeComment
  );
};
