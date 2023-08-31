const db = require("../config/db.config");
const { appUrl } = require("../helpers/appUrl");
const { multerUpload } = require("../middleware/multer");
const Recipe = db.recipes;

exports.create = async (req, res) => {
  try {
    const { title, short_dsc, ingridients, description } = req.body;
    const data = await Recipe.create({
      title,
      ingridients: JSON.stringify(ingridients),
      short_dsc,
      description: JSON.stringify(description),
    });
    res.status(200).send(data);
  } catch (err) {
    res.status(500).json({ message: `${err}` });
  }
};

exports.getAll = async (req, res) => {
  const { limit = 20, offset = 0 } = req.query;
  await Recipe.findAll({
    limit,
    offset,
  })
    .then((data) => {
      // console.log(data, "DATA");
      // data = data.map((el) => ({
      //   ...el.dataValues,
      //   ingridients: JSON.parse(el.dataValues.ingridients),
      // }));
      // console.log(data, "DATA");
      res.status(200).send({ data });
    })
    .catch((err) => {
      res.status(500).json({ message: `${err}` });
    });
};

exports.getById = async (req, res) => {
  const id = req.params.id;
  await Recipe.findByPk(id, {})
    .then((data) => {
      // console.log(data, "DATA");
      // data = {
      //   ...data.dataValues,
      //   ingridients: JSON.parse(data.dataValues.ingridients),
      // };

      res.status(200).send({ data });
    })
    .catch((err) => {
      res.status(500).json({ message: `${err}` });
    });
};

exports.update = async (req, res) => {
  try {
    const id = req.params.id;
    const data = await Recipe.findByPk(id, {});
    if (!data) throw new Error("Recipe with given id is not found");
    data.update(req?.body?.data);
    res.status(200).json({ data });
  } catch (err) {
    res.status(500).json({ message: `${err}` });
  }
};

exports.delete = async (req, res) => {
  const id = req.params.id;
  // console.log(req.params);
  await Recipe.destroy({
    where: { id },
  })
    .then(() => {
      res.status(200).send("Recipe has been deleted!");
    })
    .catch((err) => {
      res.status(500).json({ message: `${err}` });
    });
};

exports.uploadImageById = async (req, res) => {
  try {
    const id = req.params.id;
    const data = await Recipe.findByPk(id, {});
    if (!data) throw new Error("Recipe with given id is not found");

    const filePath = appUrl + req.file.path;
    data.update({ img_url: filePath });
    res.status(200).json({ data });
  } catch (e) {
    res.status(500).json({ error: `${e}` });
  }
};

exports.uploadImage = async (req, res) => {
  try {
    const filePath = appUrl + req.file.path;
    res.status(200).send({ data: filePath });
  } catch (e) {
    res.status(500).json({ error: `${e}` });
  }
};
