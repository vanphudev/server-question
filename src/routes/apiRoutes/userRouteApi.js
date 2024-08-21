const express = require("express");
const {register, login} = require("../../services/Users/CRUDUser");
const routesUsers = express.Router();

routesUsers.post("/register", register);
routesUsers.post("/login", login);
module.exports = {
   routesUsers,
};
