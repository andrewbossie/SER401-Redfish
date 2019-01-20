const express = require("express");
const path = require("path");
const routes_controller = require("../Controllers/RoutesController");

module.exports = app => {
  app.use(express.static("./Resources"));
  app.get("/panels", routes_controller.getPanels);
  app.get("/", routes_controller.getAvailableMetrics);
  app.get("/:metric", routes_controller.getMetric);
};
