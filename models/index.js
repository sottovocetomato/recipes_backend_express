const dbConfig = require("../config/db.config.js");

const { Sequelize } = require("sequelize");
const sequelize = new Sequelize(dbConfig.DB, dbConfig.USER, dbConfig.PASSWORD, {
  host: dbConfig.HOST,
  dialect: dbConfig.dialect,
  operatorsAliases: false,
  pool: {
    max: dbConfig.pool.max,
    min: dbConfig.pool.min,
    acquire: dbConfig.pool.acquire,
    idle: dbConfig.pool.idle
  },
  define: {
    timestamps: false
  }
});

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.receipts = require("./receipt.model.js")(sequelize, Sequelize);
db.categories = require("./category.model.js")(sequelize, Sequelize);

db.categories.belongsToMany(db.receipts, { through: 'ReceiptsCategories' });
db.receipts.belongsToMany(db.categories, { through: 'ReceiptsCategories' });
// db.categories.belongsTo(db.receipts)
// db.receipts.hasOne(db.categories)

module.exports = db;