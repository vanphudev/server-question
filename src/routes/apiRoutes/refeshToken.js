const express = require("express");
const {RefreshAccessToken} = require("../../middlewares/refreshAccessToken");
const routesRefreshToken = express.Router();

routesRefreshToken.post("/refresh-token", RefreshAccessToken);

module.exports = {
   routesRefreshToken,
};
