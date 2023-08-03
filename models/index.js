const db = require("../config/db.config");
const { sequelize, Sequelize } = db;

db.recipes = require("./receipe.model.js")(sequelize, Sequelize);
db.categories = require("./category.model.js")(sequelize, Sequelize);
db.users = require("./user.model.js")(sequelize, Sequelize);
db.ingridients = require("./ingridients.model.js")(sequelize, Sequelize);

db.categories.belongsToMany(db.receipts, { through: "ReceiptsCategories" });
db.recipes.belongsToMany(db.categories, { through: "ReceiptsCategories" });
db.ingridients.belongsToMany(db.receipts, { through: "ReceiptsCategories" });
