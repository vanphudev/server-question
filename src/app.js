const express = require("express");
const {rootRouter} = require("./routes/apiRoutes");
const cors = require("cors");
app = express();
require("dotenv").config();

var bodyParser = require("body-parser");
app.use(bodyParser.json());

app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(
   cors({
      methods: ["GET", "POST", "PUT", "DELETE"],
      allowedHeaders: ["Content-Type", "Authorization"],
   })
);
const cookieParser = require("cookie-parser");
app.use(cookieParser());
const extractToken = (req, res, next) => {
   const authHeader = req.headers.authorization;
   if (authHeader && authHeader.startsWith("Bearer ")) {
      const token = authHeader.split(" ")[1];
      req.token = token;
   }
   next();
};
app.use(extractToken);
app.use("/api/v1", rootRouter);

module.exports = app;
