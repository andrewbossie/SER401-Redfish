const express = require("express");
const path = require("path");
const routes_controller = require("../Controllers/RoutesController");

module.exports = app => {
  app.use(express.static("./Resources"));
  app.get("/", routes_controller.getPanels);
  app.get("/metrics", routes_controller.getAvailableMetrics);
  app.get("/metrics/:metric", routes_controller.getMetric);
};
