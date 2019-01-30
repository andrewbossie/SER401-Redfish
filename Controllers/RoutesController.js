const request = require("request");

// Render Static Panels in Grafana
exports.getPanels = function(req, res) {
  res.render("index.hbs", {
    pageTitle: "Redfish Telemetry Client",
    currentYear: new Date().getFullYear()
  });
};

exports.getDefinitionCollection = function(req, res) {
  request(
    {
      url:
        "http://localhost:8001/redfish/v1/TelemetryService/MetricReportDefinitions",
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
        }
        res.json(metrics);
      }
    }
  );
};

// Currently being used for the landing page.
exports.getAvailableMetrics = function(req, res) {
  request(
    {
      url:
        "http://localhost:8001/redfish/v1/TelemetryService/MetricReportDefinitions",
      json: true
    },
    (error, response, body) => {
      if (!body) {
        res.status(404);
        res.json({
          error: "Could not retrieve metrics"
        });
      } else if (error) {
        // console.log(error);
      } else {
        let metrics = [];
        // for (var i = 0; i < body['available'].length; i++) {
        //   let uri = body['available'][i];
        //   metrics.push(uri);
        // }
        for (var i = 0; i < body.Members.length; i++) {
          let uri = body.Members[i]["@odata.id"];
          // metrics.push(uri.split("/")[uri.split("/").length - 1]);
          metrics.push(uri);
        }
        console.log(metrics);
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
      url: `http://localhost:8001/redfish/v1/TelemetryService/MetricReportDefinitions/${metric}`,
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

exports.postSelectedMetrics = function(req, res) {
  let selectedMetrics = req.body;
  if (selectedMetrics.from && selectedMetrics.metrics) {
    let metricReport = selectedMetrics.from;
    // TODO: Future sprint - create function to do the I/O tasks for
    // Metric-select persistence.

    // Redfish Mockup Server does not seem to be accepting the PATCH request.
    request.patch(
      {
        url: `http://localhost:8001/redfish/v1/TelemetryService/MetricReportDefinitions/${metricReport}`,
        json: true,
        body: {
          Status: {
            State: "Enabled"
          }
        }
      },
      (error, response, body) => {
        console.log(response);
      }
    );

    res.json(selectedMetrics);
  } else {
    res.json({
      error: "Bad Format"
    });
  }

  // TODO: create incoming JSON format
  // let format = {
  //   from: "MetricReportName",
  //   metrics: ["metric1", "metric2", "..."]
  // };
};
