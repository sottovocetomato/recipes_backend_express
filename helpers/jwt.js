const jwt = require("jsonwebtoken");
const JWT_TOKEN = process.env.JWT_TOKEN;

export function generateToken(user) {
  return jwt.sign({ data: user }, JWT_TOKEN, { expiresIn: "24h" });
}
