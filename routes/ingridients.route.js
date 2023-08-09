const ingrCntrlr = require("../controllers/ingridients.controller");
const { checkToken } = require("../middleware/checkToken");
const { verifySignUp } = require("../middleware/verifySignUp");

module.exports = function (app) {
  app.post("/api/ingridients", ingrCntrlr.create);
  app.post("/api/ingridients/filter", ingrCntrlr.getAllFilter);

  app.get("/api/ingridients/:id", ingrCntrlr.getById);

  app.get("/api/ingridients", ingrCntrlr.getAll);

  app.patch("/api/ingridients/:id", ingrCntrlr.update);

  app.delete("/api/ingridients/:id", ingrCntrlr.delete);
};
