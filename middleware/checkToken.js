const jwt = require("jsonwebtoken");
const tokenSecret = process.env.JWT_TOKEN;

exports.checkToken = (req, res, next) => {
  try {
    const token = req?.headers?.authorization;
    if (!token || token == "null" || token == null)
      res.status(400).json({ message: "please provide a token" });
    else {
      console.log(token.split(" ")[1], "token");
      jwt.verify(token.split(" ")[1], tokenSecret, (err, value) => {
        if (err) throw new Error(err);
        req.user = value?.data;
        next();
      });
    }
  } catch (err) {
    res.status(500).json({ message: `${err.message}` });
  }
};
