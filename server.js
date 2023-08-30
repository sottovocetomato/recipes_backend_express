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
        title: "units",
      },
    });

    if (!unitColl) {
      const res = await Collections.create({
        title: "units",
        data: JSON.stringify([
          { id: 1, title: "кг" },
          { id: 2, title: "г" },
          { id: 3, title: "ч.л." },
          { id: 4, title: "ст.л" },
          { id: 5, title: "стакан" },
          { id: 6, title: "мл" },
          { id: 7, title: "мл" },
        ]),
      });
      console.log(res, "RES");
    }

    const ingr = await Ingridients.findAll();
    console.log(ingr, "ingr");
    if (!ingr || !ingr.length || !Object.keys(ingr).length) {
      await Ingridients.create({
        name: "Огурчик",
        description: "Вкусный Огурчик",
      });
      await Ingridients.create({
        name: "Подорожник",
        description: "Вкусный Подорожник",
      });
      await Ingridients.create({
        name: "Дыня",
        description: "Вкусный Дыня",
      });
      await Ingridients.create({
        name: "Сок томатный",
        description: "Вкусный Сок томатный",
      });
      await Ingridients.create({
        name: "Кандибобер",
        description: "Вкусный Кандибобер",
      });
    }
  } catch (error) {
    console.log(error, "FROM INITIAL FUNCTION IN SERVER");
  }
}
