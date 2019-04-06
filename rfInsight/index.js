const express = require("express");
const hbs = require("hbs");
const http = require("http");
const baseRoutes = require("./routes/baseRoutes");
var app_controller = require("./controllers/AppController");

let router = express.Router();

const app = express();
hbs.registerPartials(__dirname + "/views/partials");
app.set("view engine", "hbs");

baseRoutes(app, router);

app.listen(8080);
