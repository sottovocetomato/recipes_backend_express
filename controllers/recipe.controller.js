const db = require("../config/db.config");
const { appUrl } = require("../helpers/appUrl");
const { multerUpload } = require("../middleware/multer");
const { setObjProperty, mergeObjects } = require("../helpers/main");
const { Op } = require("sequelize");
const Recipe = db.recipes;
const User = db.users;
const Categories = db.categories;
const RecipeSteps = db.recipe_steps;
const RecipeIngridients = db.recipe_ingridients;
const Ingridients = db.ingridients;

exports.create = async (req, res) => {
  try {
    let token = req?.headers?.authorization;
    token = token.split(" ")[1];
    const {
      title,
      short_dsc,
      recipe_ingridients,
      recipe_steps,
      category_id,
      img_url,
    } = req.body;
    // console.log(req.files.length, "FILEEEEEEEEEEEEEEEEEEEES");
    // console.log(req.body, "REEEEEEEEEEEEEEQ BODY");

    let recData = {
      title,
      recipe_ingridients,
      short_dsc,
      recipe_steps,
      category_id,
      img_url,
    };
    if (
      !title ||
      !short_dsc ||
      !recipe_ingridients ||
      !recipe_steps ||
      !category_id
    ) {
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
    console.log(recipe_steps, "STEP");
    const data = await Recipe.create({
      title,
      short_dsc,
      category_id,
      img_url: recData.img_url,
    });

    const ingrsIds = recipe_ingridients.map((el) => el.ingridientId);
    data.addCategories(category_id);

    const steps = await RecipeSteps.bulkCreate(recipe_steps, {
      returning: true,
    });
    const ingrs = await RecipeIngridients.bulkCreate(recipe_ingridients, {
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
    include: [Categories, RecipeIngridients, RecipeSteps],
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
      userId: req.params.userId,
    },
    include: [Categories, RecipeIngridients, RecipeSteps],
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
  await Recipe.findByPk(id, {
    include: [Categories, RecipeIngridients, RecipeSteps],
  })
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
    const recipe = await Recipe.findByPk(id, {
      include: [Categories, RecipeIngridients, RecipeSteps],
    });
    if (!recipe) throw new Error("Recipe with given id is not found");

    let recData = req.body;

    if (req.files.length) {
      req.files.forEach((file) => {
        const imgPath = appUrl + file.path;
        setObjProperty(recData, file.fieldname, imgPath);
      });
    }
    // mergeObjects(data.dataValues, recData)
    // console.log(data.dataValues, "DATAAAAA");
    // console.log(recipe);
    const { recipe_steps, recipe_ingridients } = recData;
    const stepsIds = [];
    for (const obj of recipe_steps) {
      const id = parseInt(obj.id);
      if (!isNaN(id)) {
        stepsIds.push(obj.id);
      }
    }

    if (stepsIds.length) {
      await RecipeSteps.destroy({
        where: { recipeId: id, id: { [Op.notIn]: stepsIds } },
      }).catch((e) => Promise.reject(e));
    }

    const ingrIds = [];
    for (const obj of recipe_ingridients) {
      const id = parseInt(obj.id);
      if (!isNaN(id)) {
        ingrIds.push(obj.id);
      }
    }

    if (ingrIds.length) {
      await RecipeIngridients.destroy({
        where: { recipeId: id, id: { [Op.notIn]: ingrIds } },
      }).catch((e) => Promise.reject(e));
    }

    const stepsToUpdate = await RecipeSteps.findAll({
      where: { recipeId: id },
    });
    for (const obj of stepsToUpdate) {
      const updateData = recipe_steps.find((e) => e.id == obj.id);
      await obj.update(updateData).catch((e) => Promise.reject(e));
    }
    recipe_steps.forEach((el) => console.log(el, "EL"));
    const stepsToCreate = recipe_steps.filter((el) => !el.id);

    if (stepsToCreate.length) {
      const createdSteps = await RecipeSteps.bulkCreate(stepsToCreate, {
        returning: true,
      }).catch((e) => Promise.reject(e));
      recipe.addRecipe_steps(createdSteps);
    }

    const ingrsToUpdate = await RecipeIngridients.findAll({
      where: { recipeId: id },
    });

    for (const obj of ingrsToUpdate) {
      const updateData = recipe_ingridients.find((e) => e.id == obj.id);
      await obj.update(updateData).catch((e) => Promise.reject(e));
    }
    const ingrsToCreate = recipe_ingridients.filter((el) => !el.id);

    if (ingrsToCreate.length) {
      const createdIngrs = await RecipeIngridients.bulkCreate(ingrsToCreate, {
        returning: true,
      }).catch((e) => Promise.reject(e));
      recipe.addRecipe_ingridients(createdIngrs);
    }
    recipe
      .update({
        title: recData.title,
        short_dsc: recData.short_dsc,
        category_id: recData.category_id,
        img_url: recData.img_url,
      })
      .catch((e) => Promise.reject(e));

    recipe.setCategories(recData.category_id);
    // recipe.setRecipe_steps(recipe_steps);
    // recipe.setRecipe_ingridients(recipe_ingridients);
    recipe.addIngridients(recipe_ingridients.map((el) => +el.ingridientId));

    res.status(200).send({ data: recipe });
  } catch (err) {
    res.status(500).json({ message: `${err}` });
    Promise.reject(err);
    // throw new Error(err);
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
