const { Sequelize, DataTypes, Model } = require("sequelize");
module.exports = (sequelize, Sequelize) => {
  const User = sequelize.define(
    "users",
    {
      username: {
        type: DataTypes.STRING,
        allowNull: false,
        min: 4,
        max: 40,
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: { isEmail: true },
        min: 5,
        max: 23,
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
        min: 6,
        max: 23,
      },
      token: {
        type: DataTypes.TEXT("long"),
        allowNull: true,
      },
      role: {
        type: DataTypes.STRING,
        defaultValue: "user",
      },

      user_img: DataTypes.STRING,
    },
    {
      scopes: {
        withoutPass: {
          attributes: { exclude: ["password"] },
        },
      },
    }
  );

  return User;
};
