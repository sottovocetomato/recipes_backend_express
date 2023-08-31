const { Sequelize, DataTypes, Model } = require("sequelize");
module.exports = (sequelize, Sequelize) => {
  const Recipe = sequelize.define(
    "recipe",
    {
      title: {
        type: DataTypes.STRING,
      },
      ingridients: {
        type: DataTypes.TEXT,
      },
      short_dsc: {
        type: DataTypes.TEXT,
      },
      description: {
        type: DataTypes.TEXT("long"),
      },
      img_url: {
        type: DataTypes.STRING,
      },
    },
    {
      timestamps: false,
    }
  );

  return Recipe;
};
