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
        const token = generateToken(newUser);
        newUser.update({ token });
        res.status(200).json({ user: newUser });
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
    bcrypt.compare(password, existingUser?.password, async (err, match) => {
      if (err) throw new Error(err);
      const token = generateToken(existingUser);
      existingUser.token = token;
      await existingUser.update({ token });
      if (match) {
        res.status(200).json({ user: existingUser });
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
    let token = req?.headers?.authorization;
    console.log(token);
    if (!token) throw new Error("token is not provided");
    token = token.split(" ")[1];
    await User.findOne({
      where: { token },
    })
      .then((user) => {
        if (user) {
          res.status(200).json({ user: user });
        }
      })
      .catch((error) => {
        throw new Error(error);
      });
  } catch (error) {
    res.status(500).json({ error: error });
  }
};

exports.updateUser = async (req, res) => {
  try {
    const { id } = req.body.id;
    const user = await User.findByPk(id, {});
    if (!user) {
      throw new Error(`user with given id: ${req.body.id} cannot be found!`);
    }
    user.update(req?.body?.data);
  } catch (error) {
    res.status(500).json({ error: error });
  }
};
