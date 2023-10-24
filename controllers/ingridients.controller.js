const db = require("../config/db.config");
const Ingridient = db.ingridients;
const Recipe = db.recipes;
const { Op } = require("sequelize");
const { parseFilter } = require("../helpers/filter");
const { getPaginationMeta, getOffset } = require("../helpers/main");
const { multerUpload } = require("../middleware/multer");
const { appUrl } = require("../helpers/appUrl");

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
  console.log(req.query, "REQ QUERY");
  let { limit = db.limit, page = 1 } = req.query;
  await Ingridient.findAndCountAll({
    limit: parseInt(limit),
    offset: getOffset(limit, page),
  })
    .then(({ count, rows: data }) => {
      const _meta = getPaginationMeta({ limit, page, count });
      res.status(200).send({ data, _meta });
    })
    .catch((err) => {
      res.status(500).json({ error: `${err}` });
    });
};

exports.getAllRecipes = async (req, res) => {
  console.log(req.query, "REQ QUERY");
  let { limit = db.limit, page = 1 } = req.query;
  const id = req.params.id;
  await Recipe.findAll({
    include: [
      {
        model: Ingridient,
        where: {
          id,
        },
        through: {
          attributes: [],
        },
      },
    ],
    limit: parseInt(limit),
    offset: getOffset(limit, page),
  })
    .then((data) => {
      res.status(200).send({ data });
    })
    .catch((err) => {
      console.log(err, "error");
      res.status(500).json({ error: `${err}` });
    });
};

exports.getAllFilter = async (req, res) => {
  let { limit = db.limit, page = 1 } = req.query;
  const { filters = {} } = req.body;

  await Ingridient.findAll({
    limit: parseInt(limit),
    offset: getOffset(limit, page),
    where: parseFilter(filters),
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
    console.log(data, "DATA");
    console.log(req?.body, "req?.body?.data");
    if (!data) throw new Error("Ingridient with given id is not found");
    await data.update(req?.body).then((data) => res.status(200).json({ data }));
  } catch (e) {
    res.status(500).json({ error: e });
  }
};

exports.uploadImage = async (req, res) => {
  try {
    console.log("uploadImage controller");
    console.log(req.file);
    const id = req.params.id;
    const data = await Ingridient.findByPk(id, {});
    if (!data) throw new Error("Ingridient with given id is not found");

    const filePath = appUrl + req.file.path;
    data.update({ img_url: filePath });
    res.status(200).json({ data });
  } catch (e) {
    res.status(500).json({ error: `${e}` });
  }
};

exports.delete = async (req, res) => {
  const id = req.params.id;
  // console.log(req.params);
  await Ingridient.destroy({
    where: { id },
  })
    .then(() => {
      res.status(200).send({ message: "Ингредиент удалён!" });
    })
    .catch((err) => {
      res.status(500).json({ error: err });
    });
};
