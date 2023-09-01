const express = require("express");
const app = express();
const port = 3000;
const path = require("path");
const receiptsRouter = require("./routes/routes");
const cors = require("cors");

const db = require("./config/db.config");

// Нужно только для разработки на локалке, потом удалить
const Collections = db.collections;
const Ingridients = db.ingridients;
const Categories = db.categories;
//

app.use(express.json());

app.use(express.static(__dirname + "/public"));

const corsOptions = {
  origin: "http://localhost:5173",
  optionsSuccessStatus: 200,
};
app.use(cors(corsOptions));

app.use(function (req, res, next) {
  // Website you wish to allow to connect
  res.setHeader("Access-Control-Allow-Origin", "http://localhost:5173");
  // res.setHeader("Access-Control-Allow-Origin", "http://receipts.haemmid.ru");

  // Request methods you wish to allow
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, OPTIONS, PUT, PATCH, DELETE"
  );

  // Request headers you wish to allow
  res.setHeader(
    "Access-Control-Allow-Headers",
    "X-Requested-With,content-type"
  );

  // Set to true if you need the website to include cookies in the requests sent
  // to the API (e.g. in case you use sessions)
  res.setHeader("Access-Control-Allow-Credentials", true);

  // Pass to next layer of middleware
  next();
});

app.use(
  express.urlencoded({
    extended: true,
  })
);

app.use("/static", express.static(path.join(__dirname, "/static/")));

app.get("/", (req, res) => {
  res.json({ message: "ok" });
});
// app.use("/receipts", receiptsRouter);
/* Error handler middleware */
app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  console.error(err.message, err.stack);
  res.status(statusCode).json({ message: err.message });
  return;
});

// routes
// require("./routes/routes")(app);
require("./routes/auth.route")(app);
require("./routes/ingridients.route")(app);
require("./routes/recipes.route")(app);
require("./routes/collections.route.")(app);
require("./routes/categories.route.")(app);

db.sequelize
  .authenticate()
  .then(() => {
    console.log("Connection has been established successfully.");
  })
  .catch((error) => {
    console.error("Unable to connect to the database: ", error);
  });

db.sequelize
  // .sync({ force: true })
  .sync()
  .then(async () => {
    await initCollection();
    console.log("Synced db.");
  })
  .catch((err) => {
    console.log("Failed to sync db: " + err.message);
  });

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});

// Нужно только для разработки на локалке, потом удалить
async function initCollection() {
  try {
    const unitColl = await Collections.findOne({
      where: {
        collection: "units",
      },
    });
    if (!unitColl) {
      const res = await Collections.bulkCreate([
        {
          collection: "units",
          title: "кг",
          slug: "kg",
        },
        {
          collection: "units",
          title: "г",
          slug: "gramms",
        },
        {
          collection: "units",
          title: "ч.л.",
          slug: "teaspoon",
        },
        {
          collection: "units",
          title: "ст.л",
          slug: "tablespoon",
        },
        {
          collection: "units",
          title: "стакан",
          slug: "cup",
        },
        {
          collection: "units",
          title: "мл",
          slug: "ml",
        },
        {
          collection: "units",
          title: "л",
          slug: "l",
        },
      ]);
    }

    const ingr = await Ingridients.findAll();

    if (!ingr || !ingr.length || !Object.keys(ingr).length) {
      await Ingridients.bulkCreate([
        {
          name: "Огурчик",
          description: "Вкусный Огурчик",
        },
        {
          name: "Подорожник",
          description: "Вкусный Подорожник",
        },
        {
          name: "Дыня",
          description: "Вкусный Дыня",
        },
        {
          name: "Сок томатный",
          description: "Вкусный Сок томатный",
        },
        {
          name: "Кандибобер",
          description: "Вкусный Кандибобер",
        },
      ]);
    }

    const category = await Categories.findAll();
    if (!category || !category.length || !Object.keys(category).length) {
      await Categories.bulkCreate([
        {
          title: "Завтрак",
        },
        {
          title: "Обед",
        },
        {
          title: "Ужин",
        },
        {
          title: "Десерт",
        },
        {
          title: "Низкокалорийное",
        },
        {
          title: "Закуски",
        },
        {
          title: "Первые блюда",
        },
        {
          title: "Вторые блюда",
        },
      ]);
    }
  } catch (error) {
    console.log(error, "FROM INITIAL FUNCTION IN SERVER");
  }
}
