const db = require("../config/db.config.js");
const bcrypt = require("bcrypt");
const saltRounds = 10;
const jwt = require("jsonwebtoken");
const { generateToken } = require("../helpers/jwt");
const {appUrl} = require("../helpers/appUrl");
const {setObjProperty} = require("../helpers/main");
const User = db.users;

exports.register = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    bcrypt.hash(password, saltRounds, async (err, hash) => {
      if (err) throw new Error(err);
      else {
        const newUser = await User.create({
          username,
          email,
          password: hash,
        });
        const token = generateToken({ email, id: newUser?.id });
        newUser.update({ token });
        delete newUser.dataValues.password;
        res.status(200).json({ data: newUser });
      }
    });
  } catch (e) {
    res.status(500).json({ error: e });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const existingUser = await User.findOne({
      where: {
        email,
      },
    });
    if (!existingUser) throw new Error("User with given email was not found");
    const { id } = existingUser;
    bcrypt.compare(password, existingUser?.password, async (err, match) => {
      if (err) throw new Error(err);
      const token = generateToken({ id, email: existingUser.email });
      existingUser.token = token;
      await existingUser.update({ token });
      delete existingUser.dataValues.password;
      if (match) {
        res.status(200).send({ data: existingUser });
        return;
      }
      res.status(403).send({ error: "passwords do not match" });
    });
  } catch (e) {
    res.status(500).send({ error: `${e.message}` });
  }
};

exports.me = async (req, res) => {
  try {
    let token = req?.headers?.authorization;
    console.log(token);
    if (!token) throw new Error("token is not provided");
    token = token.split(" ")[1];
    await User.scope("withoutPass")
      .findOne({
        where: { token },
      })
      .then((user) => {
        if (user) {
          res.status(200).send({ data: user });
        } else {
          res
            .status(500)
            .send({ message: "TokenExpiredError: User not found" });
        }
      })
      .catch((error) => {
        Promise.reject(error);
      });
  } catch (error) {
    res.status(500).json({ message: error });
  }
};

exports.updateMe = async (req, res) => {
  try {
    let token = req?.headers?.authorization;
    if (!token) throw new Error("token is not provided");
    token = token.split(" ")[1];
    const user = await User.scope("withoutPass").findOne({
      where: { token },
    })
    if (!user) {
      throw new Error(`User cannot be found!`);
    }
    let recData = req.body;

    if (req.file) {
      const imgPath = appUrl + req.file.path;
      recData.user_img = imgPath
    }
    await user.update(recData).catch(e => res.status(500).json({ message: `${e}`}));
    res.status(200).json({ data: user });
  } catch (e) {
    res.status(500).json({ message: `${e}` });
  }
};
