const { Sequelize, DataTypes, Model } = require("sequelize");
module.exports = (sequelize, Sequelize) => {
  const Collection = sequelize.define(
    "collection",

    {
      id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
      title: {
        type: DataTypes.STRING,
      },
      data: DataTypes.TEXT,
    },
    {
      timestamps: false,
    }
  );

  return Collection;
};
