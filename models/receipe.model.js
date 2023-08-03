const { Sequelize, DataTypes, Model } = require("sequelize");
module.exports = (sequelize, Sequelize) => {
  const Receipe = sequelize.define(
    "receipe",
    {
      title: {
        type: DataTypes.STRING,
      },
      ingredients: {
        type: DataTypes.TEXT,
      },
      text: {
        type: DataTypes.TEXT,
      },
      img_url: {
        type: DataTypes.STRING,
      },
    },
    {
      timestamps: false,
    }
  );

  return Receipe;
};
