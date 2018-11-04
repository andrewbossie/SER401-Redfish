const express = require("express");
const hbs = require("hbs");
const baseRoutes = require("./routes/baseRoutes");
var app_conroller = require("./Controllers/AppController");

setInterval(app_conroller.writeDataTest, 5000);

const app = express();
hbs.registerPartials(__dirname + "/views/partials");
app.set("view engine", "hbs");

baseRoutes(app);

app.listen(8080);
