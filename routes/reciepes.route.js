const receipeController = require("../controllers/reciepe.controller");
const { checkToken } = require("../middleware/checkToken");
const { verifySignUp } = require("../middleware/verifySignUp");

module.exports = function (app) {
  app.post("/api/reciepes", receipeController.create);
  app.get("/api/receipes/:id", receipeController.getById);
  app.get("/api/receipes", receipeController.getAll);
  app.patch("/api/reciepes/:id", receipeController.update);
  app.delete("/api/reciepes/:id", receipeController.delete);
};
