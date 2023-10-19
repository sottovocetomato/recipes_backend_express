const db = require("../config/db.config");
const { appUrl } = require("../helpers/appUrl");
const { multerUpload } = require("../middleware/multer");
const {
  setObjProperty,
  mergeObjects,
  setOrder,
  getOffset,
  getPaginationMeta,
} = require("../helpers/main");
const { Op, QueryTypes } = require("sequelize");
const { parseFilter } = require("../helpers/filter");
const Recipe = db.recipes;
const User = db.users;
const Category = db.categories;
const RecipeStep = db.recipe_steps;
const RecipeIngridient = db.recipe_ingridients;
const Ingridient = db.ingridients;
const FavoriteRecipe = db.favorite_recipes;
const RecipeLike = db.recipe_likes;
const RecipeComment = db.recipe_comments;

exports.create = async (req, res) => {
  try {
    let token = req?.headers?.authorization;
    token = token.split(" ")[1];
    const user = await User.findOne({
      where: { token },
    });

    const {
      title,
      short_dsc,
      recipe_ingridients,
      recipe_steps,
      category_id,
      cooking_time,
      portion,
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
      cooking_time,
      portion,
      img_url,
    };
    if (
      !title ||
      !short_dsc ||
      !recipe_ingridients.length ||
      !recipe_steps.length ||
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

    // console.log(recipe_steps, "STEP");
    const data = await Recipe.create({
      title,
      short_dsc,
      category_id,
      cooking_time,
      portion,
      img_url: recData.img_url,
    }).catch((e) => Promise.reject(e));

    const ingrsIds = recipe_ingridients.map((el) => el.ingridientId);
    data.addCategories(category_id);

    const steps = await RecipeStep.bulkCreate(recipe_steps, {
      returning: true,
    }).catch((e) => Promise.reject(e));
    // const ingrs = await RecipeIngridient.bulkCreate(recipe_ingridients, {
    //   returning: true,
    // }).catch((e) => Promise.reject(e));

    for (const el of recipe_ingridients) {
      console.log(el);
      await RecipeIngridient.create(el, {
        returning: true,
      })
        .then((ingr) => {
          console.log(ingr);
          ingr.setIngridient(el.ingridientId);
          // ingr.setCollection(el.unit_cid);
          data.addRecipe_ingridients(ingr);
        })
        .catch((e) => Promise.reject(e));
    }

    // console.log(ingrs[0]);
    data.addRecipe_steps(steps);
    data.addIngridients(ingrsIds);
    data.setUser(user?.id);

    res.status(200).send(data);
  } catch (err) {
    res.status(500).send({ message: `${err}` });
  }
};

exports.getAll = async (req, res) => {
  let { limit = 20, page = 1, order } = req.query;

  if (order) {
    order = setOrder(order);
  }

  await Recipe.findAndCountAll({
    limit: parseInt(limit),
    offset: getOffset(limit, page),
    order: order ? order : null,
    include: [Category, RecipeIngridient, RecipeStep],
    distinct: true,
  })
    .then(({ count, rows: data }) => {
      const _meta = getPaginationMeta({ limit, page, count });
      res.status(200).send({ data, _meta });
    })
    .catch((err) => {
      res.status(500).json({ message: `${err}` });
    });
};

exports.getAllByUser = async (req, res) => {
  const { limit = 20, page = 1 } = req.query;
  await Recipe.findAndCountAll({
    limit: parseInt(limit),
    offset: getOffset(limit, page),
    where: {
      userId: req.params.userId,
    },
    include: [Category, RecipeIngridient, RecipeStep],
    distinct: true,
  })
    .then(({ count, rows: data }) => {
      const _meta = getPaginationMeta({ limit, page, count });
      res.status(200).send({ data, _meta });
    })
    .catch((err) => {
      res.status(500).json({ message: `${err}` });
    });
};
exports.getAllByCategory = async (req, res) => {
  const { limit = 20, page = 1 } = req.query;
  const { categoryId } = req.params;
  await Recipe.findAndCountAll({
    limit: parseInt(limit),
    offset: getOffset(limit, page),
    include: [
      {
        model: Category,
        where: {
          id: categoryId,
        },
        through: {
          attributes: [],
        },
        required: true,
      },
    ],
    distinct: true,
  })
    .then(({ count, rows: data }) => {
      const _meta = getPaginationMeta({ limit, page, count });
      res.status(200).send({ data, _meta });
    })
    .catch((err) => {
      res.status(500).json({ message: `${err}` });
    });
};

exports.getById = async (req, res) => {
  const id = req.params.id;
  await Recipe.findByPk(id, {
    include: [
      Category,
      RecipeStep,
      { model: User, attributes: ["username", "user_img"] },
      {
        model: RecipeIngridient,
        include: [
          { model: Ingridient, attributes: ["title"] },
          // {
          //   model: Collection,
          //   as: "units",
          //   attributes: ["title"],
          //   where: { collection: "units" },
          // },
        ],
      },
      {
        model: RecipeComment,
        include: [{ model: User, attributes: ["username", "user_img"] }],
      },
    ],
  })
    .then((data) => {
      res.status(200).send({ data });
    })
    .catch((err) => {
      res.status(500).json({ message: `${err}` });
    });
};

exports.getAllFilter = async (req, res) => {
  const { limit = 20, page = 1 } = req.query;
  const { filters = {} } = req.body;

  await Recipe.findAndCountAll({
    where: parseFilter(filters),
    include: [
      {
        model: Ingridient,
        // where: parseFilter(filters),
        through: {
          attributes: [],
        },
        // required: false,
      },
    ],
    limit: parseInt(limit),
    offset: getOffset(limit, page),
  })
    .then(({ count, rows: data }) => {
      const _meta = getPaginationMeta({ limit, page, count });
      res.status(200).send({ data, _meta });
    })
    .catch((err) => {
      console.log(err, "error");
      res.status(500).json({ error: `${err}` });
    });
};

exports.getAllByTitleSQL = async (req, res) => {
  const { limit = 20, page = 1 } = req.query;
  const { filters = {} } = req.body;
  const val = parseFilter(filters, true)["title"];
  const results = await db.sequelize
    .query(
      `SELECT \`recipes\`.* FROM recipes.recipes INNER JOIN recipes.recipesingridients
        ON recipesingridients.recipeId = recipes.id
        INNER JOIN recipes.ingridients
        ON recipesingridients.ingridientId = ingridients.id
        WHERE recipes.title LIKE '${val}' OR ingridients.title LIKE '${val}'
        LIMIT ${limit} OFFSET ${getOffset(limit, page)}`,
      { type: QueryTypes.SELECT }
    )
    .catch((err) => {
      console.log(err, "error");
      res.status(500).json({ error: `${err}` });
    });
  const meta = await db.sequelize
    .query(
      `SELECT COUNT(*) FROM recipes.recipes INNER JOIN recipes.recipesingridients
        ON recipesingridients.recipeId = recipes.id
        INNER JOIN recipes.ingridients
        ON recipesingridients.ingridientId = ingridients.id
        where recipes.title LIKE '${val}' OR ingridients.title LIKE '${val}'`,
      { type: QueryTypes.SELECT }
    )
    .catch((err) => {
      console.log(err, "error");
      res.status(500).json({ error: `${err}` });
    });
  console.log(meta, "meta");
  if (results) {
    const _meta = getPaginationMeta({
      limit,
      page,
      count: meta[0]["COUNT(*)"],
    });
    res.status(200).send({ data: results, _meta });
  }
};

exports.update = async (req, res) => {
  try {
    const id = req.params.id;
    const recipe = await Recipe.findByPk(id, {
      include: [Category, RecipeIngridient, RecipeStep],
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
      await RecipeStep.destroy({
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
      await RecipeIngridient.destroy({
        where: { recipeId: id, id: { [Op.notIn]: ingrIds } },
      }).catch((e) => Promise.reject(e));
    }

    const stepsToUpdate = await RecipeStep.findAll({
      where: { recipeId: id },
    });
    for (const obj of stepsToUpdate) {
      const updateData = recipe_steps.find((e) => e.id == obj.id);
      await obj.update(updateData).catch((e) => Promise.reject(e));
    }
    recipe_steps.forEach((el) => console.log(el, "EL"));
    const stepsToCreate = recipe_steps.filter((el) => !el.id);

    if (stepsToCreate.length) {
      const createdSteps = await RecipeStep.bulkCreate(stepsToCreate, {
        returning: true,
      }).catch((e) => Promise.reject(e));
      recipe.addRecipe_steps(createdSteps);
    }

    const ingrsToUpdate = await RecipeIngridient.findAll({
      where: { recipeId: id },
    });

    for (const obj of ingrsToUpdate) {
      const updateData = recipe_ingridients.find((e) => e.id == obj.id);
      await obj.update(updateData).catch((e) => Promise.reject(e));
    }
    const ingrsToCreate = recipe_ingridients.filter((el) => !el.id);

    if (ingrsToCreate.length) {
      // const createdIngrs = await RecipeIngridient.bulkCreate(ingrsToCreate, {
      //   returning: true,
      // }).catch((e) => Promise.reject(e));
      for (const el of ingrsToCreate) {
        console.log(el);
        await RecipeIngridient.create(el, {
          returning: true,
        })
          .then((ingr) => {
            ingr.setIngridient(el.ingridientId);
            // ingr.setCollection(el.unit_cid);
            recipe.addRecipe_ingridients(ingr);
          })
          .catch((e) => Promise.reject(e));
      }
    }
    recipe
      .update({
        title: recData.title,
        short_dsc: recData.short_dsc,
        category_id: recData.category_id,
        cooking_time: recData.cooking_time,
        portion: recData.portion,
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

exports.addFavoriteRecipe = async (req, res) => {
  try {
    const { userId, recipeId } = req.body;
    const fav = await FavoriteRecipe.findOne({
      where: { userId, recipeId },
    });
    if (fav) {
      await fav.destroy().then(() => {
        res.status(200).send("Recipe has been unfaved!");
      });
    } else {
      await FavoriteRecipe.create({ userId, recipeId }).then(() => {
        res.status(200).send("Recipe has been faved!");
      });
    }
  } catch (err) {
    res.status(500).json({ message: `${err}` });
  }
};

exports.getFavoriteRecipe = async (req, res) => {
  const { userId, recipeId } = req.body;
  await FavoriteRecipe.findOne({ where: { userId, recipeId } })
    .then((recipe) => {
      res.status(200).send({ data: recipe });
    })
    .catch((err) => {
      res.status(500).json({ message: `${err}` });
    });
};

exports.getAllFavoriteRecipes = async (req, res) => {
  const { limit = 20, page = 1 } = req.query;
  const { userId } = req.body;
  await FavoriteRecipe.findAndCountAll({
    where: { userId },
    include: [Recipe],
    attributes: [],
    distinct: true,
  })
    .then(({ count, rows: data }) => {
      const _meta = getPaginationMeta({ limit, page, count });
      res.status(200).send({ data, _meta });
    })
    .catch((err) => {
      res.status(500).json({ message: `${err}` });
    });
};

exports.addToLikes = async (req, res) => {
  try {
    const { userId, recipeId } = req.body;
    const fav = await RecipeLike.findOne({
      where: { userId, recipeId },
    });
    const recipe = await Recipe.findByPk(recipeId);
    if (fav) {
      await fav.destroy().then(() => {
        recipe.update({ likes: --recipe.likes > 0 ? --recipe.likes : 0 });
        res.status(200).send("Recipe has been unliked!");
      });
    } else {
      await RecipeLike.create({ userId, recipeId }).then(async () => {
        recipe.update({ likes: ++recipe.likes });
        res.status(200).send("Recipe has been liked!");
      });
    }
  } catch (err) {
    res.status(500).json({ message: `${err}` });
  }
};
