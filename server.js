const express = require("express");
const app = express();
const port = 5000;
const path = require("path");
require("./models/index");
const cors = require("cors");

const db = require("./config/db.config");

const bcrypt = require("bcrypt");
const { generateToken } = require("./helpers/jwt");

// Нужно только для разработки на локалке, потом удалить
const Collections = db.collections;
const Ingridients = db.ingridients;
const User = db.users;
const Categories = db.categories;
//
app.set("base", "/qae");
app.use(express.json());

app.use(express.static(__dirname + "/public"));

// const corsOptions = {
//   origin: "http://localhost:5173",
//   optionsSuccessStatus: 200,
// };
// app.use(cors(corsOptions));
app.use(cors());

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
app.get("/recipes-server", (req, res) => {
  res.json({ message: "ok" });
});

/* Error handler middleware */
app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  console.error(err.message, err.stack);
  res.status(statusCode).json({ message: err.message });
  return;
});

// routes

require("./routes/auth.route")(app);
require("./routes/ingridients.route")(app);
require("./routes/recipes.route")(app);
require("./routes/collections.route.")(app);
require("./routes/categories.route.")(app);

db.sequelize
  .authenticate()
  .then(async () => {
    console.log("Connection has been established successfully.");
  })
  .catch((error) => {
    console.error("Unable to connect to the database: ", error);
  });

const forceSync = async () => {
  await db.sequelize.query("SET FOREIGN_KEY_CHECKS = 0");
  await db.sequelize.sync({ force: true });
  await db.sequelize.query("SET FOREIGN_KEY_CHECKS = 1"); // setting the flag back for security
};

const sync = async () => {
  db.sequelize
    .sync()
    .then(async () => {
      // await initCollection();
      console.log("Synced db.");
    })
    .catch((err) => {
      console.log("Failed to sync db: " + err.message);
    });
};

// forceSync();
sync();
app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});

// Нужно только для разработки на локалке, потом удалить
// async function initCollection() {
//   try {
//     const unitColl = await Collections.findOne({
//       where: {
//         collection: "units",
//       },
//     });
//     if (!unitColl) {
//       const res = await Collections.bulkCreate([
//         {
//           collection: "units",
//           title: "кг",
//           slug: "kg",
//         },
//         {
//           collection: "units",
//           title: "г",
//           slug: "gramms",
//         },
//         {
//           collection: "units",
//           title: "ч.л.",
//           slug: "teaspoon",
//         },
//         {
//           collection: "units",
//           title: "ст.л",
//           slug: "tablespoon",
//         },
//         {
//           collection: "units",
//           title: "стакан",
//           slug: "cup",
//         },
//         {
//           collection: "units",
//           title: "мл",
//           slug: "ml",
//         },
//         {
//           collection: "units",
//           title: "л",
//           slug: "l",
//         },
//       ]);
//     }
//
//     const ingr = await Ingridients.findAll();
//
//     if (!ingr || !ingr.length || !Object.keys(ingr).length) {
//       await Ingridients.bulkCreate([
//         {
//           title: "Огурчик",
//           description: "Вкусный Огурчик",
//         },
//         {
//           title: "Подорожник",
//           description: "Вкусный Подорожник",
//         },
//         {
//           title: "Дыня",
//           description: "Вкусный Дыня",
//         },
//         {
//           title: "Сок томатный",
//           description: "Вкусный Сок томатный",
//         },
//         {
//           title: "Кандибобер",
//           description: "Вкусный Кандибобер",
//         },
//       ]);
//     }
//     const user = await User.findByPk(1);
//     if (!user) {
//       bcrypt.hash("admin123", 10, async (err, hash) => {
//         if (err) throw new Error(err);
//         else {
//           const newUser = await User.create({
//             username: "admin",
//             email: "admin@test.com",
//             password: hash,
//             role: "admin",
//           });
//           const token = generateToken({
//             email: "admin@test.com",
//             id: newUser?.id,
//           });
//           newUser.update({ token });
//         }
//       });
//       bcrypt.hash("user1123", 10, async (err, hash) => {
//         if (err) throw new Error(err);
//         else {
//           const newUser = await User.create({
//             username: "user1",
//             email: "user@test.com",
//             password: hash,
//           });
//           const token = generateToken({
//             email: "user@test.com",
//             id: newUser?.id,
//           });
//           newUser.update({ token });
//         }
//       });
//       bcrypt.hash("user2123", 10, async (err, hash) => {
//         if (err) throw new Error(err);
//         else {
//           const newUser = await User.create({
//             username: "user2",
//             email: "user2@test.com",
//             password: hash,
//           });
//           const token = generateToken({
//             email: "admin@test.com",
//             id: newUser?.id,
//           });
//           newUser.update({ token });
//         }
//       });
//     }
//
//     const category = await Categories.findAll();
//     if (!category || !category.length || !Object.keys(category).length) {
//       await Categories.bulkCreate([
//         {
//           title: "Завтрак",
//         },
//         {
//           title: "Обед",
//         },
//         {
//           title: "Ужин",
//         },
//         {
//           title: "Десерт",
//         },
//         {
//           title: "Низкокалорийное",
//         },
//         {
//           title: "Закуски",
//         },
//         {
//           title: "Первые блюда",
//         },
//         {
//           title: "Вторые блюда",
//         },
//       ]);
//     }
//   } catch (error) {
//     console.log(error, "FROM INITIAL FUNCTION IN SERVER");
//   }
// }
