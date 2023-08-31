const collectionsCntrl = require("../controllers/collections.controller.js");
const { checkToken } = require("../middleware/checkToken");
const ingrCntrlr = require("../controllers/ingridients.controller");

module.exports = function (app) {
  app.post("/api/collections/filter", collectionsCntrl.getAllFilter);
  app.get("/api/me", collectionsCntrl.getAll);
  app.get("/api/collections/:id", collectionsCntrl.getById);
};
