const db = require("../config/db.config");
const Ingridient = db.ingridients;
const { Op } = require("sequelize");
const { parseFilter } = require("../helpers/filter");

exports.create = async (req, res) => {
  try {
    const { name, description } = req.body;
    const data = await Ingridient.create({
      name,
      description,
    });
    res.status(200).json({ data });
  } catch (e) {
    res.status(500).json({ error: e });
  }
};

exports.getAll = async (req, res) => {
  const { limit = 20, offset = 0 } = req.query;
  await Ingridient.findAll({
    limit,
    offset,
  })
    .then((data) => {
      res.status(200).send({ data });
    })
    .catch((err) => {
      res.status(500).json({ error: err });
    });
};

exports.getAllFilter = async (req, res) => {
  const { limit = 20, offset = 0, filters = {} } = req.body;
  await Ingridient.findAll({
    where: parseFilter(filters),
    limit,
    offset,
  })
    .then((data) => {
      res.status(200).send({ data });
    })
    .catch((err) => {
      console.log(err, "error");
      res.status(500).json({ error: `${err}` });
    });
};

exports.getById = async (req, res) => {
  const id = req.params.id;
  await Ingridient.findByPk(id, {})
    .then((data) => {
      res.status(200).send({ data });
    })
    .catch((err) => {
      res.status(500).json({ error: err });
    });
};

exports.update = async (req, res) => {
  try {
    const id = req.params.id;
    const data = await Ingridient.findByPk(id, {});
    if (!data) throw new Error("Ingridient with given id is not found");
    data.update(req?.body?.data);
    res.status(200).json({ data });
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
