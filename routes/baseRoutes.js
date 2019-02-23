const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
const routes_controller = require("../Controllers/RoutesController");
const test_controller = require("../Controllers/TestController");

module.exports = (app, router) => {
  app.use(express.static("./Resources"));
  app.use(bodyParser.urlencoded({ extended: true }));
  app.use(bodyParser.json());

  /*
  * This set of routes represents the API service to the frontend.
  */
  router
    .route("/metrics")
    .get(routes_controller.getDefinitionCollection)
    .post(routes_controller.postSelectedMetrics);
  router.route("/event_in").post(routes_controller.handleEventIn);
  router.route("/sub_type").post(routes_controller.postSubType);
  router.route("/redfish_ip").post(routes_controller.postRedfishIp);
  router.route("/metrics/:metric").get(routes_controller.getMetric);
  router.route("/config").get(routes_controller.getCurrentConfig);
  router.route("/test").get(test_controller.testGo);
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
