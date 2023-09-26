const db = require("../config/db.config");
const { sequelize, Sequelize } = db;

db.recipes = require("./recipe.model.js")(sequelize, Sequelize);
db.categories = require("./category.model.js")(sequelize, Sequelize);
db.users = require("./user.model.js")(sequelize, Sequelize);
db.ingridients = require("./ingridients.model.js")(sequelize, Sequelize);
db.collections = require("./collections.model.js")(sequelize, Sequelize);
db.recipe_steps = require("./recipe_step.model")(sequelize, Sequelize);
db.recipe_ingridients = require("./recipe_ingridient.model")(
  sequelize,
  Sequelize
);

db.categories.belongsToMany(db.recipes, { through: "RecipesCategories" });
db.recipes.belongsToMany(db.categories, { through: "RecipesCategories" });

db.users.hasMany(db.recipes);
db.recipes.belongsTo(db.users);

db.recipe_steps.belongsTo(db.recipes);
db.recipes.hasMany(db.recipe_steps);

db.recipe_ingridients.belongsTo(db.recipes);
db.recipes.hasMany(db.recipe_ingridients);

// db.recipe_ingridients.belongsTo(db.collections, {
//   foreignKey: "unit_cid",
//   as: "units",
// });
// db.collections.hasOne(db.recipe_ingridients, {
//   foreignKey: "unit_cid",
//   as: "units",
// });

db.recipe_ingridients.belongsTo(db.ingridients);
db.ingridients.hasMany(db.recipe_ingridients);

db.ingridients.belongsToMany(db.recipes, {
  through: "RecipesIngridients",
});

db.recipes.belongsToMany(db.ingridients, {
  through: "RecipesIngridients",
});
