const { Sequelize, DataTypes, Model } = require("sequelize");
module.exports = (sequelize, Sequelize) => {
  const Unit = sequelize.define(
    "unit",

    {
      id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
      title: {
        type: DataTypes.STRING,
      },
    },
    {
      timestamps: false,
    }
  );

  return Unit;
};
