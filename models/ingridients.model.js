const { Sequelize, DataTypes, Model } = require("sequelize");
module.exports = (sequelize, Sequelize) => {
  const Ingridient = sequelize.define(
    "ingridient",
    {
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      description: {
        type: DataTypes.TEXT,
        max: 250,
      },
        img_url: {
            type: DataTypes.STRING,
        },
    },
    {
      timestamps: false,
    }
  );

  return Ingridient;
};
