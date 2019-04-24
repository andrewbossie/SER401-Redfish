// const keys = require("../config/keys");
const request = require("request");
const util = require("../resources/js/util");
const rTools = require("../resources/js/redfishTools");

const influx = require("./InfluxController").influx;

// This module is deprecated.

// Update influx from API
// exports.updateCPUUtil = () => {
//   request(
//     {
//       url:
//         "http://localhost:8001/redfish/v1/TelemetryService/MetricReports/CPUMetrics",
//       json: true
//     },
//     (error, response, body) => {
//       if (error) {
//         console.log("Unable to connect to server.");
//       } else {
//         if (body.MetricValues) {
//           let cpuUtil_1 = rTools.getMetric(
//             body.MetricValues,
//             "CPUPercentUtil",
//             1,
//             1
//           );
//           let cpuUtil_2 = rTools.getMetric(
//             body.MetricValues,
//             "CPUPercentUtil",
//             1,
//             2
//           );
//           let cpuUtil_3 = rTools.getMetric(
//             body.MetricValues,
//             "CPUPercentUtil",
//             1,
//             3
//           );
//
//           updateMetric(metrics.cpuUtil_1, cpuUtil_1);
//           updateMetric(metrics.cpuUtil_2, cpuUtil_2);
//           updateMetric(metrics.cpuUtil_3, cpuUtil_3);
//         }
//       }
//     }
//   );
// };

// Grab Influx Data. Can we do this without nesting?
exports.getInfluxData = function(req, res) {
  var cpu = [];
  var temp = [];
  var cpu_time = [];
  var temp_time = [];

  // Get CPU Metrics
  let getCPUData = influx.query("SELECT * FROM cpu").catch(err => {
    console.error(`Error retrieving data from Influx. ${err.stack}`);
  });

  let getTempData = influx.query("SELECT * FROM temp").catch(err => {
    console.error(`Error retrieving data from Influx. ${err.stack}`);
  });

  // Promise.all allows us to wait for all calls to resolve. This way, we don't need to nest callbacks
  Promise.all([getCPUData, getTempData]).then(results => {
    for (var i = 0; i < results[0].length; i++) {
      cpu_time[i] = results[0][i]["time"];
      cpu[i] = results[0][i]["value"];
    }

    for (var i = 0; i < results[1].length; i++) {
      temp_time[i] = results[1][i]["time"];
      temp[i] = results[1][i]["value"];
    }

    res.render("chart.hbs", {
      pageTitle: "Redfish Insight",
      cpu: cpu,
      temp: temp,
      cpu_time: cpu_time,
      temp_time: temp_time
    });
  });
};
/*
 * Note: Redfish API Specification DateTime values are in ISO 8601 "extended"
 *  format: ex. "2017-11-23T17:17:42-0600"
 *
 *   Current RedishMockupServer metric reports contain format
 *     "20161108T142504-0500"
 */
