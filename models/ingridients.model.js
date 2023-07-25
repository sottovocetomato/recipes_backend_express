const { Sequelize, DataTypes, Model } = require("sequelize");
module.exports = (sequelize, Sequelize) => {
  const Ingridient = sequelize.define(
    "Ingridient",
    {
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      description: {
        type: DataTypes.TEXT,
        max: 250,
      },
    },
    {
      timestamps: false,
    }
  );

  return Ingridient;
};
