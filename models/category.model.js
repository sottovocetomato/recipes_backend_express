const { Sequelize, DataTypes, Model } = require("sequelize");
module.exports = (sequelize, Sequelize) => {
  const Category = sequelize.define(
    "category",
    {
      title: {
        type: DataTypes.STRING,
      },
    },
    {
      timestamps: false,
    }
  );

  return Category;
};
