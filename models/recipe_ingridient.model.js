const { Sequelize, DataTypes, Model } = require("sequelize");
module.exports = (sequelize, Sequelize) => {
  const RecipeIngridient = sequelize.define(
    "recipe_ingridient",
    {
        ingridientId: DataTypes.INTEGER,
        unit_cid: {
        type: DataTypes.INTEGER,
      },
      quantity: {
        type: DataTypes.INTEGER,
      },
    },
    {
      timestamps: false,
    }
  );

  return RecipeIngridient;
};
