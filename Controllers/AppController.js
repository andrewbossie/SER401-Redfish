const keys = require("../config/keys");
const request = require("request");
const Influx = require("influx");
const util = require("../Resources/js/util");
const rTools = require("../Resources/js/redfishTools");

// Get CPU data
let metrics = {
   cpuUtil_1: {
      date: null,
      timestamp: null,
      metric: null
   },
   cpuUtil_2: {
      date: null,
      timestamp: null,
      metric: null
   },
   cpuUtil_3: {
      date: null,
      timestamp: null,
      metric: null
   }
};

let updateMetric = (target, newMetric) => {
   let date = new Date(util.convertToIsoDate(newMetric.TimeStamp));
   d2 = new Date();
   now = d2.getSeconds();
   date.setMinutes(date.getMinutes() + now);

   target.timestamp = Influx.toNanoDate(date);
   target.metric = newMetric.MetricValue;
};

// Update influx from API
exports.updateCPUUtil = () => {
   request(
      {
         url:
            "http://localhost:800/redfish/v1/TelemetryService/MetricReports/CPUMetrics",
         json: true
      },
      (error, response, body) => {
         if (error) {
            console.log("Unable to connect to server.");
         } else {
            if (body.MetricValues) {
               let cpuUtil_1 = rTools.getMetric(
                  body.MetricValues,
                  "CPUPercentUtil",
                  1,
                  1
               );
               let cpuUtil_2 = rTools.getMetric(
                  body.MetricValues,
                  "CPUPercentUtil",
                  1,
                  2
               );
               let cpuUtil_3 = rTools.getMetric(
                  body.MetricValues,
                  "CPUPercentUtil",
                  1,
                  3
               );

               updateMetric(metrics.cpuUtil_1, cpuUtil_1);
               updateMetric(metrics.cpuUtil_2, cpuUtil_2);
               updateMetric(metrics.cpuUtil_3, cpuUtil_3);
            }
         }
      }
   );
};

// InfluxDB Connection
const influx = new Influx.InfluxDB({
   host: keys.influxHost,
   database: "test",
   username: keys.influxUserName,
   password: keys.influxPassword,

   schema: [
      {
         measurement: "CPUPercentUtil",
         fields: { value: Influx.FieldType.FLOAT },
         tags: ["host", "tray", "id"]
      },
      {
         measurement: "temp",
         fields: { value: Influx.FieldType.FLOAT },
         tags: ["host"]
      }
   ]
});

// Random test data (DEPRECATED)
exports.writeDataTest = function() {
   influx
      .writePoints(
         [
            {
               measurement: "CPUPercentUtil",
               tags: { host: "serverA", tray: 1, id: 1 },
               fields: { value: metrics.cpuUtil_1.metric },
               timestamp: metrics.cpuUtil_1.timestamp.getNanoTime()
            },
            {
               measurement: "CPUPercentUtil",
               tags: { host: "serverA", tray: 1, id: 2 },
               fields: { value: metrics.cpuUtil_2.metric },
               timestamp: metrics.cpuUtil_2.timestamp.getNanoTime()
            },
            {
               measurement: "CPUPercentUtil",
               tags: { host: "serverA", tray: 1, id: 3 },
               fields: { value: metrics.cpuUtil_3.metric },
               timestamp: metrics.cpuUtil_3.timestamp.getNanoTime()
            },
            {
               measurement: "cpu",
               tags: { host: "serverB" },
               fields: { value: Math.random() * 75 }
            },
            {
               measurement: "temp",
               tags: { host: "serverA" },
               fields: { value: Math.random() * 200 }
            }
         ],
         {
            database: "test",
            precision: "s"
         }
      )
      .catch(err => {
         console.error(`Error writing data to Influx. ${err.stack}`);
      });
};

// Render Static Panels in Grafana
exports.getPanels = function(req, res) {
   res.render("index.hbs", {
      pageTitle: "Redfish Telemetry Client",
      currentYear: new Date().getFullYear()
   });
};

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
         pageTitle: "Redfish Telemetry Client (Js)",
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
