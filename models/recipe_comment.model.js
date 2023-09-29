const { Sequelize, DataTypes, Model } = require("sequelize");
module.exports = (sequelize, Sequelize) => {
  const RecipeComment = sequelize.define("recipe_comment", {
    userId: {
      type: DataTypes.INTEGER,
    },
    recipeId: {
      type: DataTypes.INTEGER,
    },
    comment: {
      type: DataTypes.TEXT("long"),
    },
  });

  return RecipeComment;
};
