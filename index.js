const express = require("express");
const hbs = require("hbs");
const http = require("http");
const baseRoutes = require("./routes/baseRoutes");
var app_conroller = require("./Controllers/AppController");

// (DEPRECATED)
// setInterval(app_conroller.writeDataTest, 5000);

const app = express();
hbs.registerPartials(__dirname + "/views/partials");
app.set("view engine", "hbs");

baseRoutes(app);

app.listen(8080);
