const request = require("request");

// Render Static Panels in Grafana
exports.getPanels = function(req, res) {
  res.render("index.hbs", {
    pageTitle: "Redfish Telemetry Client",
    currentYear: new Date().getFullYear()
  });
};

// Route handler for /metrics
// This will return a JSON array of URIs to each available metric report.

// TODO: Once the metric definition JSON files are fixed, change
// what's being returned here. We want definition returns, not actual
// metric report returns. That's saved for InfluxDB.
exports.getAvailableMetrics = function(req, res) {
  request(
    {
      url:
        "http://localhost:8000/redfish/v1/TelemetryService/MetricReportDefinitions",
      json: true
    },
    (error, response, body) => {
      if (!body) {
        res.status(404);
        res.json({
          error: "Could not retrieve metrics"
        });
      } else if (error) {
        console.log(error);
      } else {
        let metrics = [];
        for (var i = 0; i < body.Members.length; i++) {
          let uri = body.Members[i]["@odata.id"];
          metrics.push(uri.split("/")[uri.split("/").length - 1]);
          // metrics.push(uri);
        }
        // res.json(metrics);
          res.render("landing.hbs", {
              pageTitle: "Redfish Telemetry Client",
              metrics: metrics
          });
      }
    }
  );
};

// Route handler for /metrics/:metric
// Note: the mockup server isn't sending proper HTTP responses for
// bad requests. This is why !body is checked after the request is made.
exports.getMetric = function(req, res) {
  let metric = req.params.metric;
  console.log(typeof metric);
  request(
    {
      url: `http://localhost:8000/redfish/v1/TelemetryService/MetricReportDefinitions/${metric}`,
      json: true
    },
    (error, response, body) => {
      if (!body) {
        res.status(404);
        res.json({
          error: "Metric does not exist",
          metric: metric
        });
      } else if (error) {
        console.log(error);
      } else {
        console.log(body);
        res.json(body);
      }
    }
  );
};
