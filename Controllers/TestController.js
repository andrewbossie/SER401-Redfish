const request = require("request");

const GO_HOST = "https://Administrator:password@172.17.0.2:443";

exports.testGo = function(req, res) {
  request(
    {
      method: "GET",
      // Here we basically blindly accept all unauthorized endpoints, which
      // from a security standpoint isn't great. However for this use case,
      // that is, connecting to a simulation environment in a contained environment,
      // it's acceptable. For now.
      rejectUnauthorized: false,
      url: `${GO_HOST}/redfish/v1/TelemetryService/MetricReportDefinitions`,
      json: true
    },
    (err, response, body) => {
      if (!body) {
        console.log(err);
        res.status(404);
        res.json({
          error: "Error connecting to Sailfish."
        });
      } else {
        res.json(body);
      }
    }
  );
};
