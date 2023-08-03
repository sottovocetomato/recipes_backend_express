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

exports.getAll = async (req, res) => {
  const { limit = 20, offset = 0 } = req.params;
  await Receipe.findAll({
    limit,
    offset,
  })
    .then((receipes) => {
      res.status(200).send({ receipes });
    })
    .catch((err) => {
      res.status(500).json({ error: err });
    });
};

exports.getById = async (req, res) => {
  const id = req.params.id;
  await Receipe.findByPk(id, {})
    .then((receipe) => {
      res.status(200).send({ receipe });
    })
    .catch((err) => {
      res.status(500).json({ error: err });
    });
};

exports.update = async (req, res) => {
  try {
    const id = req.params.id;
    const receipe = await Receipe.findByPk(id, {});
    if (!receipe) throw new Error("Receipe with given id is not found");
    receipe.update(req?.body?.data);
    res.status(200).json({ receipe });
  } catch (e) {
    res.status(500).json({ error: e });
  }
};

exports.delete = async (req, res) => {
  const id = req.params.id;
  // console.log(req.params);
  await Receipe.destroy({
    where: { id },
  })
    .then(() => {
      res.status(200).send("Receipe has been deleted!");
    })
    .catch((err) => {
      res.status(500).json({ error: err });
    });
};
