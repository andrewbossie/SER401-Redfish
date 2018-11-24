const express = require("express");
const path = require("path");
const app_controller = require("../Controllers/AppController");

module.exports = app => {
  app.use(express.static("./Resources"));

  app.get("/", app_controller.getPanels);
};
