const db = require("../config/db.config");
const { sequelize, Sequelize } = db;

db.receipts = require("./receipt.model.js")(sequelize, Sequelize);
db.categories = require("./category.model.js")(sequelize, Sequelize);
db.users = require("./user.model.js")(sequelize, Sequelize);
db.ingridients = require("./ingridients.model.js")(sequelize, Sequelize);

db.categories.belongsToMany(db.receipts, { through: "ReceiptsCategories" });
db.receipts.belongsToMany(db.categories, { through: "ReceiptsCategories" });
db.ingridients.belongsToMany(db.receipts, { through: "ReceiptsCategories" });
