const db = require("../config/db.config.js");
const bcrypt = require("bcrypt");
const saltRounds = 10;
const jwt = require("jsonwebtoken");
const User = db.users;

const JWT_SECRET = "my-secret-token";

exports.register = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    bcrypt.hash(password, saltRounds, async (err, hash) => {
      if (err) res.status(500).json({ error: err });
      else {
        await User.create({
          username,
          email,
          password: hash,
        });
      }
    });
  } catch (e) {}
};
