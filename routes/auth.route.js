const authRoute = require("../controllers/auth.controller.js");
const { checkToken } = require("../middleware/checkToken");
const { verifySignUp } = require("../middleware/verifySignUp");

module.exports = function (app) {
  app.post(
    "/api/auth/register",
    verifySignUp.checkDuplicateUsernameOrEmail,
    authRoute.register
  );
};
