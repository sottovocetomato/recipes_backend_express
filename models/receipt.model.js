const { Sequelize, DataTypes, Model } = require('sequelize');
module.exports = (sequelize, Sequelize) => {
  const Receipt = sequelize.define("receipt", {
    title: {
      type: DataTypes.STRING
    },
    ingredients: {
      type: DataTypes.TEXT
    },
    text: {
      type: DataTypes.TEXT
    },
    img_url: {
      type: DataTypes.STRING
    },
  },
    {
      timestamps: false
    });

  return Receipt;
};