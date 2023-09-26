const db = require("../config/db.config");
const Collection = db.collections;
const { Op } = require("sequelize");
const { parseFilter } = require("../helpers/filter");
const { getPaginationMeta } = require("../helpers/main");
const { multerUpload } = require("../middleware/multer");
const { appUrl } = require("../helpers/appUrl");

exports.getAll = async (req, res) => {
  console.log(req.query, "REQ QUERY");
  let { limit = 20, page = 1 } = req.query;
  limit = parseInt(limit);
  page = parseInt(page);
  await Collection.findAndCountAll({
    limit: limit,
    offset: limit * --page,
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
  const { limit = 20, offset = 0 } = req.query;
  const { filters = {}, attributes = [] } = req.body;
  await Collection.findAll({
    where: parseFilter(filters),
    attributes,
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
  await Collection.findByPk(id, {})
    .then((data) => {
      res.status(200).send({ data });
    })
    .catch((err) => {
      res.status(500).json({ error: err });
    });
};
