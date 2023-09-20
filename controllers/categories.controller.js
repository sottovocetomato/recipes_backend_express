const db = require("../config/db.config");
const Category = db.categories;
const Recipe = db.recipes;
const { Op } = require("sequelize");
const { parseFilter } = require("../helpers/filter");
const { getPaginationMeta, getOffset } = require("../helpers/main");
const { multerUpload } = require("../middleware/multer");
const { appUrl } = require("../helpers/appUrl");

exports.getAll = async (req, res) => {
  console.log(req.query, "REQ QUERY");
  let { limit = 20, page = 1 } = req.query;
  await Category.findAndCountAll({
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

exports.getAllFilter = async (req, res) => {
  let { limit = 20, page = 1 } = req.query;
  const { filters = {} } = req.body;
  await Category.findAll({
    where: parseFilter(filters),
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

exports.getById = async (req, res) => {
  const id = req.params.id;
  await Category.findByPk(id, {})
    .then((data) => {
      res.status(200).send({ data });
    })
    .catch((err) => {
      res.status(500).json({ error: err });
    });
};

exports.getAllRecipes = async (req, res) => {
  console.log(req.query, "REQ QUERY");
  let { limit = 20, page = 1 } = req.query;
  const id = req.params.id;
  await Recipe.findAll({
    include: [
      {
        model: Category,
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
