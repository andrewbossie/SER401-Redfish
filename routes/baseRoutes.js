const express = require("express");
const path = require("path");
const routes_controller = require("../Controllers/RoutesController");

module.exports = (app, router) => {
  app.use(express.static("./Resources"));

  router.route("/graphs").get(routes_controller.getPanels);
  router.route("/metrics").get(routes_controller.getDefinitionCollection);
  router.route("/metrics/:metric").get(routes_controller.getMetric);
  app.use("/api", router);
  // app.get("/graphs", routes_controller.getPanels);
  app.get("/", routes_controller.getAvailableMetrics);
  // app.get("/:metric", routes_controller.getMetric);

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
