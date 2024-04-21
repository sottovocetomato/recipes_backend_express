const db = require("../config/db.config");
const { checkItemExistsHelper } = require("../helpers/main");

exports.checkExistingItem =
  (tableName, field = "name") =>
  (req, res, next) => {
    const entry = checkItemExistsHelper(db, tableName, field, req.body);
    if (entry) {
      res.status(400).send({
        message: `Запись с именем ${req.body[field]} уже существует`,
      });
      return;
    }
    next();
  };
