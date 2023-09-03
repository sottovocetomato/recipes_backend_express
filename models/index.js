const db = require("../config/db.config");
const { sequelize, Sequelize } = db;

db.recipes = require("./recipe.model.js")(sequelize, Sequelize);
db.categories = require("./category.model.js")(sequelize, Sequelize);
db.users = require("./user.model.js")(sequelize, Sequelize);
db.ingridients = require("./ingridients.model.js")(sequelize, Sequelize);
db.collections = require("./collections.model.js")(sequelize, Sequelize);

db.categories.belongsToMany(db.recipes, { through: "ReceipesCategories" });
db.recipes.belongsToMany(db.categories, { through: "ReceipesCategories" });
db.ingridients.belongsToMany(db.recipes, {
  foreignKey: "recipeId",
  as: "Recipes",
  through: "ReceipesIngridients",
});
db.recipes.belongsToMany(db.ingridients, {
  foreignKey: "ingridientId",
  as: "Ingridients",
  through: "ReceipesIngridients",
});
