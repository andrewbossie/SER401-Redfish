const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
const routes_controller = require("../Controllers/RoutesController");

module.exports = (app, router) => {
  app.use(express.static("./Resources"));
  app.use(bodyParser.urlencoded());
  app.use(bodyParser.json());

  /*
  * This set of routes represents the API service to the frontend.
  */
  router
    .route("/metrics")
    .get(routes_controller.getDefinitionCollection)
    .post(routes_controller.postSelectedMetrics);
  router.route("/metrics/:metric").get(routes_controller.getMetric);
  app.use("/api", router);

  /*
  * These are actual application routes.
  */
  app.get("/graphs", routes_controller.getPanels);
  app.get("/datagenerator", routes_controller.getDataGenerator);
  app.get("/generateMockData", routes_controller.generateMockData);
  app.get("/", routes_controller.getAvailableMetrics);
  app.get("/:metric", routes_controller.getMetric);
  

  // This is a catchall for any bad request.
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
