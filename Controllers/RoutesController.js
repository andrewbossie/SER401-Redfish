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
exports.getAvailableMetrics = function(req, res) {
  request(
    {
      url: "http://localhost:8000/redfish/v1/TelemetryService/MetricReports",
      json: true
    },
    (error, response, body) => {
      if (error) {
        console.log(error);
      } else {
        let metrics = [];
        for (var i = 0; i < body.Members.length; i++) {
          let uri = body.Members[i]["@odata.id"];
          // metrics.push(uri.split("/")[uri.split("/").length - 1]);
          metrics.push(uri);
        }
        res.json(metrics);
      }
    }
  );
};

// Route handler for /metrics/:metric
exports.getMetric = function(req, res) {
  let metric = req.params.metric;
  console.log(metric);
  request(
    {
      url: `http://localhost:8000/redfish/v1/TelemetryService/MetricReports/${metric}`,
      json: true
    },
    (error, response, body) => {
      if (error) {
        console.log(error);
      } else {
        console.log(body);
        res.json(body);
      }
    }
  );
};
