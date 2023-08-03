const db = require("../config/db.config");
const Ingridient = db.ingridients;

exports.create = async (req, res) => {
  try {
    const { name, description } = req.body;
    const newIngridient = await Ingridient.create({
      name,
      description,
    });
    res.status(200).json({ user: newIngridient });
  } catch (e) {
    res.status(500).json({ error: e });
  }
};

exports.getAll = async (req, res) => {
  const { limit = 20, offset = 0 } = req.params;
  await Ingridient.findAll({
    limit,
    offset,
  })
    .then((ingridient) => {
      res.status(200).send({ ingridient });
    })
    .catch((err) => {
      res.status(500).json({ error: err });
    });
};

exports.getById = async (req, res) => {
  const id = req.params.id;
  await Ingridient.findByPk(id, {})
    .then((ingridient) => {
      res.status(200).send({ ingridient });
    })
    .catch((err) => {
      res.status(500).json({ error: err });
    });
};

exports.update = async (req, res) => {
  try {
    const id = req.params.id;
    const ingridient = await Ingridient.findByPk(id, {});
    if (!ingridient) throw new Error("Ingridient with given id is not found");
    ingridient.update(req?.body?.data);
    res.status(200).json({ ingridient });
  } catch (e) {
    res.status(500).json({ error: e });
  }
};

exports.delete = async (req, res) => {
  const id = req.params.id;
  // console.log(req.params);
  await Ingridient.destroy({
    where: { id },
  })
    .then(() => {
      res.status(200).send("Ingridient has been deleted!");
    })
    .catch((err) => {
      res.status(500).json({ error: err });
    });
};
