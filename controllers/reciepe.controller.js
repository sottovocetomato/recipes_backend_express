const db = require("../config/db.config");
const Receipe = db.recipes;

exports.create = async (req, res) => {
  try {
    const { text, title, img_url, ingredients } = req.body;
    const newReceipe = await Receipe.create({
      text,
      title,
      img_url,
      ingredients,
    });
    res.status(200).json({ user: newReceipe });
  } catch (e) {
    res.status(500).json({ error: e });
  }
};
