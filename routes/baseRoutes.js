const express = require("express");
const path = require("path");
const routes_controller = require("../Controllers/RoutesController");

module.exports = app => {
  app.use(express.static("./Resources"));
  app.get("/graphs", routes_controller.getPanels);
  app.get("/datagenerator", routes_controller.getDataGenerator);
  app.get("/", routes_controller.getAvailableMetrics);
  app.get("/:metric", routes_controller.getMetric);
  
  app.all("*", function(req, res) {
    res.status(404);
    res.json({
      error: "Bad Request",
      method: req.method,
      code: 404,
      url: req.url
    });
  });
};
