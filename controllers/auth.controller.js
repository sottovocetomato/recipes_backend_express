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
