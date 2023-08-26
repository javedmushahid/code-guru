const { model } = require("mongoose");
const { loggerUtil } = require("../utils/logger");
const auth = require("./auth");
const {
  isSameUserOrAdmin,
  isSignedIn,
  isValidToken,
} = require("../middleware");

const expenseRoute = require("./expense");

const routes = (app) => {
  // Test Route for API
  app.get("/welcome", (req, res) => {
    loggerUtil("Welcome API called.");
    res.send(
      "Welcome to API for Wellness Spoiled.\n Servers are Up and Running"
    );
  });
  app.use("/api/v1", auth);

  app.use("/api/v1", isSignedIn, isValidToken, expenseRoute);

  return app;
};
module.exports = routes;
