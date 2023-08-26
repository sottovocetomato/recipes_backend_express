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
        res.status(200).json({ data: existingUser });
        return;
      }
      res.status(403).json({ error: "passwords do not match" });
    });
  } catch (e) {
    res.status(500).json({ error: `${e.message}` });
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
    const user = await User.scope("withoutPass").findByPk(id, {});
    if (!user) {
      throw new Error(`user with given id: ${req.body.id} cannot be found!`);
    }
    user.update(req?.body?.data);
    res.status(200).json({ data: user });
  } catch (error) {
    res.status(500).json({ error: error });
  }
};
