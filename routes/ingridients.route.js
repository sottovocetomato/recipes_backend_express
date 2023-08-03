const ingrCntrlr = require("../controllers/ingridients.controller");
const { checkToken } = require("../middleware/checkToken");
const { verifySignUp } = require("../middleware/verifySignUp");

module.exports = function (app) {
  app.post("/api/ingridients/add", ingrCntrlr.create);
  app.get("/api/ingridients/:id", ingrCntrlr.getById);
  app.get("/api/ingridients", ingrCntrlr.getAll);
  app.patch("/api/ingridients/update", ingrCntrlr.update);
  app.delete("/api/ingridients/:id", ingrCntrlr.delete);
};
