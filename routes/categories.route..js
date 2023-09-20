const categoriesCntrl = require("../controllers/categories.controller.js");
const { checkToken } = require("../middleware/checkToken");

module.exports = function (app) {
  app.post("/api/categories/filter", categoriesCntrl.getAllFilter);
  app.get("/api/categories", categoriesCntrl.getAll);
  app.get("/api/categories/:id", categoriesCntrl.getById);
  app.get("/api/categories/:id/recipes", categoriesCntrl.getAllRecipes);
};
