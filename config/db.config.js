require("dotenv").config();
// module.exports = {
//   HOST: process.env.DB_HOST,
//   USER: process.env.DB_USER,
//   PASSWORD: process.env.DB_PASS,
//   DB: process.env.DB_NAME,
//   dialect: "mysql",
//   pool: {
//     max: 5,
//     min: 0,
//     acquire: 30000,
//     idle: 10000,
//   },
// };
const { Sequelize, DataTypes } = require("sequelize");
const fs = require("fs");
const path = require("path");
const basename = path.basename(__filename);

const db = {};

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASS,
  {
    host: process.env.DB_HOST,
    dialect: "mysql",
    operatorsAliases: false,
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000,
    },
    // define: {
    //   timestamps: false,
    // },
  }
);
// fs
//     .readdirSync('./models')
//     .filter((file) => {
//         console.log(file)
//         const returnFile = (file.indexOf('.') !== 0)
//             && (file !== basename)
//             && (file.slice(-3) === '.js');
//         return returnFile;
//     })
//     .forEach((file) => {
//         console.log(file, "file");
//         const model = require(path.join('../models', file))(sequelize, Sequelize, DataTypes);
//         console.log(model, "model")
//         db[model.name] = model;
//         console.log(db[model.name], "db[model.name]")
//     });
//
//
// Object.keys(db).forEach((modelName) => {
//     if (db[modelName].associate) {
//         db[modelName].associate(db);
//     }
// });

db.Sequelize = Sequelize;
db.sequelize = sequelize;

module.exports = db;
