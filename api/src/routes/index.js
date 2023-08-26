const { model } = require("mongoose");
const { loggerUtil } = require("../utils/logger");
const auth = require("./auth");
const { isSameUserOrAdmin, isSignedIn, isValidToken } = require("../middleware");
const myprofileRoute = require("./myProfile");
const ticketsRoute = require("./ticket");
const noteRoute = require("./Note");
const feedbackRoute = require("./Feedback");
const randomUserRoute = require("./randomUser");
const searchRoute = require("./search");
const chatRoute = require("./chatRoutes");
const contactFormRoute = require("./contactForm");
const expenseRoute = require("./expense");



const routes = (app) => {
    // Test Route for API
    app.get("/welcome", (req, res) => {
      loggerUtil("Welcome API called.");
      res.send(
        "Welcome to API for Wellness Spoiled.\n Servers are Up and Running"
      );
    });
    app.use( contactFormRoute);

    app.use("/api/v1", auth);
    app.use("/api/v1",isSignedIn,isValidToken,myprofileRoute)
    app.use("/api/v1",isSignedIn,isValidToken,ticketsRoute)
    app.use("/api/v1", isSignedIn, isValidToken, noteRoute);
    app.use("/api/v1", isSignedIn, isValidToken, feedbackRoute);
    app.use("/api/v1", isSignedIn, isValidToken, randomUserRoute);
    app.use("/api/v1", isSignedIn, isValidToken, searchRoute);
    app.use("/api/v1", isSignedIn, isValidToken, chatRoute);
    app.use("/api/v1", isSignedIn, isValidToken, expenseRoute);

    return app
};
module.exports=routes;