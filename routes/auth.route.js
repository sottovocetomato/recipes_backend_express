const authRoute = require("../controllers/auth.controller.js");
const { checkToken } = require("../middleware/checkToken");
const { verifySignUp } = require("../middleware/verifySignUp");
const { multerUpload } = require("../middleware/multer");

module.exports = function (app) {
  app.post(
    "/api/auth/register",
    verifySignUp.checkDuplicateUsernameOrEmail,
    authRoute.register
  );

  app.post("/api/auth/login", authRoute.login);
  app.get("/api/me", checkToken, authRoute.me);

  app.patch(
    "/api/me/update",
    [
      checkToken,
      multerUpload("users", { method: "single", methodArgs: "file" }),
    ],
    authRoute.updateMe
  );
};
