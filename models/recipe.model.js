const {Sequelize, DataTypes, Model} = require("sequelize");
module.exports = (sequelize, Sequelize) => {
    const Recipe = sequelize.define(
        "recipe",
        {
            title: {
                type: DataTypes.STRING,
            },
            ingridients: {
                type: DataTypes.TEXT("long"),
                get: function () {
                    return JSON.parse(this.getDataValue("ingridients"));
                },
                set: function (value) {
                    return this.setDataValue("ingridients", typeof value === 'object' ? JSON.stringify(value) : value);
                },
            },

            category_id: {
                type: DataTypes.TEXT("long"),
                get: function () {
                    return JSON.parse(this.getDataValue("category_id"));
                },
                set: function (value) {
                    return this.setDataValue("category_id", typeof value === 'object' ? JSON.stringify(value) : value);
                },
            },
            short_dsc: {
                type: DataTypes.TEXT,
            },
            description: {
                type: DataTypes.TEXT("long"),
                get: function () {
                    return JSON.parse(this.getDataValue("description" ))
                },
                set: function (value) {
                    return this.setDataValue("description", typeof value === 'object' ? JSON.stringify(value) : value);
                },
            },
            img_url: {
                type: DataTypes.STRING,
            },
        },
        {
            timestamps: false,
        }
    );

    return Recipe;
};
