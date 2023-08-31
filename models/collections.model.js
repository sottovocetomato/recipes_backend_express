const { Sequelize, DataTypes, Model } = require("sequelize");
module.exports = (sequelize, Sequelize) => {
  const Collection = sequelize.define(
    "collection",

    {
      collection: DataTypes.STRING,
      title: DataTypes.STRING,
      slug: DataTypes.STRING,
    }
  );

  return Collection;
};
