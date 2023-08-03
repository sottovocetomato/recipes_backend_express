const receipeController = require("../controllers/reciepe.controller");
const { checkToken } = require("../middleware/checkToken");
const { verifySignUp } = require("../middleware/verifySignUp");

module.exports = function (app) {
  app.post("/api/reciepe/add", receipeController.create);
  app.get("/api/receipe/:id", receipeController.getById);
  app.get("/api/receipe", receipeController.getAll);
  app.patch("/api/reciepe/update", receipeController.update);
  app.delete("/api/reciepe/:id", receipeController.delete);
};
