const db = require("../config/db.config.js");
const bcrypt = require("bcrypt");
const saltRounds = 10;
const jwt = require("jsonwebtoken");
const { generateToken } = require("../helpers/jwt");
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
        res.status(200).json({ token: generateToken(newUser), user: newUser });
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
    if (!existingUser) throw new Error("User with given email is not found");
    bcrypt.compare(password, existingUser?.password, (err, match) => {
      if (err) throw new Error(err);
      if (match) {
        res
          .status(200)
          .json({ token: generateToken(existingUser), user: existingUser });
        return;
      }
      res.status(403).json({ error: "passwords do not match" });
    });
  } catch (e) {
    res.status(500).json({ error: e });
  }
};

exports.me = async (req, res) => {
  try {
    await User.findOne({
      where: { token: req?.headers?.authorization },
    })
      .then((user) => {
        if (user) {
          res.status(200).json({ data: { user: user } });
        }
      })
      .catch((error) => {
        throw new Error(error);
      });
  } catch (error) {
    res.status(500).json({ error: error });
  }
};
