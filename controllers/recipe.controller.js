const db = require("../config/db.config");
const { appUrl } = require("../helpers/appUrl");
const { multerUpload } = require("../middleware/multer");
const { setObjProperty, mergeObjects } = require("../helpers/main");
const Recipe = db.recipes;
const User = db.users;
const Categories = db.categories;
const RecipeSteps = db.recipe_steps;
const RecipeIngridient = db.recipe_ingridients;
const Ingridients = db.ingridients;

exports.create = async (req, res) => {
  try {
    let token = req?.headers?.authorization;
    token = token.split(" ")[1];
    const {
      title,
      short_dsc,
      ingridients,
      recipe_steps,
      category_id,
      img_url,
    } = req.body;
    // console.log(req.files.length, "FILEEEEEEEEEEEEEEEEEEEES");
    // console.log(req.body, "REEEEEEEEEEEEEEQ BODY");

    let recData = {
      title,
      ingridients,
      short_dsc,
      recipe_steps,
      category_id,
      img_url,
    };
    if (!title || !short_dsc || !ingridients || !recipe_steps || !category_id) {
      throw new Error("Not enough data to create a recipe");
    }

    if (req.files.length) {
      req.files.forEach((file) => {
        const imgPath = appUrl + file.path;
        setObjProperty(recData, file.fieldname, imgPath);
      });
    }
    // console.log(recData, "recDataAAAAAAAAAAAAAAAA");
    const user = await User.findOne({
      where: { token },
    });
    const data = await Recipe.create({
      title,
      ingridients,
      short_dsc,
      category_id,
      img_url: recData.img_url,
    });

    const ingrsIds = ingridients.map((el) => el.ingridientId);
    data.addCategories(category_id);

    const steps = await RecipeSteps.bulkCreate(recipe_steps, {
      returning: true,
    });
    const ingrs = await RecipeIngridient.bulkCreate(ingridients, {
      returning: true,
    });

    data.addRecipe_steps(steps);
    data.addRecipe_ingridients(ingrs);
    data.addIngridients(ingrsIds);
    data.setUser(user.id);

    res.status(200).send(data);
  } catch (err) {
    res.status(500).send({ message: `${err}` });
  }
};

exports.getAll = async (req, res) => {
  const { limit = 20, offset = 0 } = req.query;
  await Recipe.findAll({
    limit,
    offset,
    include: [Categories, RecipeIngridient, RecipeSteps]
  })
    .then((data) => {
      res.status(200).send({ data });
    })
    .catch((err) => {
      res.status(500).json({ message: `${err}` });
    });
};

exports.getAllByUser = async (req, res) => {
  const { limit = 20, offset = 0 } = req.query;
  await Recipe.findAll({
    limit,
    offset,
    where: {
      userId: req.params.userId
    },
    include: [Categories, RecipeIngridient, RecipeSteps]
  })
      .then((data) => {
        res.status(200).send({ data });
      })
      .catch((err) => {
        res.status(500).json({ message: `${err}` });
      });
};

exports.getById = async (req, res) => {
  const id = req.params.id;
  await Recipe.findByPk(id, { include: Categories })
    .then((data) => {
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
    let recData = req?.body;
    if (req.files.length) {
      req.files.forEach((file) => {
        const imgPath = appUrl + file.path;
        setObjProperty(recData, file.fieldname, imgPath);
      });
    }
    // mergeObjects(data.dataValues, recData)
    // console.log(data.dataValues, "DATAAAAA");
    data.update(recData);
    res.status(200).send({ data });
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
