const express = require("express");
const {rootRouter} = require("./routes/apiRoutes");
const cors = require("cors");
app = express();
require("dotenv").config();

app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(
   cors({
      origin: "http://localhost:5173",
   })
);

app.use("/api/v1", rootRouter);

module.exports = app;
