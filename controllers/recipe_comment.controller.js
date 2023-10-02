const db = require("../config/db.config.js");
const Recipe = db.recipes
const RecipeComment = db.recipe_comments
const User = db.users

exports.addRecipeComment = async (req, res) => {
    const { userId, comment } = req.body;
    const recipeId = req.params.id;
    await RecipeComment.create({
        userId,
        recipeId,
        comment
    }).then(data => {
        res.status(200).send('Comment has been added!')
    }).catch(e =>  res.status(500).send({message: `${e}`}))
}