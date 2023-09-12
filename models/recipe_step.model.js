const {Sequelize, DataTypes, Model} = require("sequelize");
module.exports = (sequelize, Sequelize) => {
    const RecipeStep = sequelize.define(
        "recipe_step",
        {
            description: {
                type: DataTypes.STRING,
            },
            order: {
                type: DataTypes.INTEGER,
            },
            img_url: {
                type: DataTypes.STRING,
            },
        },
        {
            timestamps: false,
        }
    );

    return RecipeStep;
};
