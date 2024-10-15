const express = require("express");
const {routesQuestions} = require("./questionRouterApi");
const {routesUsers} = require("./userRouteApi");
const {routesRefreshToken} = require("./refeshToken");
const {routesAnswers} = require("./answerRouteApi");
const rootRouter = express.Router();

rootRouter.use("/questions", routesQuestions);
rootRouter.use("/users", routesUsers);
rootRouter.use("/token", routesRefreshToken);
rootRouter.use("/answers", routesAnswers);
rootRouter.use("/test", (req, res) => {
   res.status(200).json({message: "Hello World"});
});

module.exports = rootRouter;
