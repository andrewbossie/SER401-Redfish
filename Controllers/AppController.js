const keys = require("../config/keys");
const request = require("request");
const Influx = require("influx");

const util = require("../Resources/js/util");

// Get CPU data
let metrics = {
  cpuUtil: {
    date: null,
    timestamp: null,
    metric: null
  }
};

// Update influx from API
exports.updateCPUUtil = () => {
  request(
    {
      url:
        "http://localhost:8080/redfish/v1/TelemetryService/MetricReports/CPUMetrics",
      json: true
    },
    (error, response, body) => {
      if (error) {
        console.log("Unable to connect to server.");
      } else {
        if (body.MetricValues) {
          for (var i = 0; i < body.MetricValues.length; i++) {
            if (body.MetricValues[i].MemberID == "CPUPercentUtil") {
              let date = new Date(
                util.convertToIsoDate(body.MetricValues[i].TimeStamp)
              );
              d2 = new Date();
              now = d2.getSeconds();
              date.setMinutes(date.getMinutes() + now);
              //console.log(now);
              //console.log(date);
              metrics.cpuUtil.timestamp = Influx.toNanoDate(date);
              metrics.cpuUtil.metric = body.MetricValues[i].MetricValue;
            }
            // increment = increment + 1;
          }
        }
      }
    }
  );
};
// var increment = 1;

// InfluxDB Connection
const influx = new Influx.InfluxDB({
  host: keys.influxHost,
  database: "test",
  username: keys.influxUserName,
  password: keys.influxPassword,

  schema: [
    {
      measurement: "cpu",
      fields: { value: Influx.FieldType.FLOAT },
      tags: ["host"]
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
  console.log(metrics.cpuUtil.timestamp.getNanoTime());
  influx
    .writePoints(
      [
        {
          measurement: "cpu",
          tags: { host: "serverA" },
          fields: { value: metrics.cpuUtil.metric },
          timestamp: metrics.cpuUtil.timestamp.getNanoTime()
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
    pageTitle: "Redfish Telemetry Client (Grafana)",
    currentYear: new Date().getFullYear(),
    panels: [
      {
        src:
          "http://52.37.217.87:3000/d-solo/uiNmWixmz/randomdata?refresh=5s&orgId=1&panelId=2&var-Host=serverB",
        label: "Static Grafana Panel 1"
      },
      {
        src:
          "http://52.37.217.87:3000/d-solo/uiNmWixmz/randomdata?refresh=5s&orgId=1&panelId=2&var-Host=serverA",
        label: "Static Grafana Panel 2"
      },
      {
        src:
          "http://52.37.217.87:3000/d-solo/uiNmWixmz/randomdata?refresh=5s&orgId=1&var-Host=serverA&panelId=6",
        label: "Static Grafana Panel 3"
      },
      {
        src:
          "http://52.37.217.87:3000/d-solo/uiNmWixmz/randomdata?refresh=5s&orgId=1&panelId=4&var-Host=serverB",
        label: "Static Grafana Panel 4"
      },
      {
        src:
          "http://52.37.217.87:3000/d-solo/uwmb0iBmz/testdash?refresh=5s&panelId=4&fullscreen&orgId=1",
        label: "TestDash Custom Panel 1 (New Plugin)"
      },
      {
        src:
          "http://52.37.217.87:3000/d-solo/uwmb0iBmz/testdash?refresh=5s&panelId=2&fullscreen&orgId=1",
        label: "TestDash Custom Panel 2 (New Plugin)"
      }
    ]
  });
};

// Grab Influx Data. Can we do this without nesting?
exports.getInfluxData = function(req, res) {
  var cpu = [];
  var temp = [];
  var cpu_time = [];
  var temp_time = [];

  // Get CPU Metrics
  influx
    .query("SELECT * FROM cpu")
    .catch(err => {
      console.error(`Error retrieving data from Influx. ${err.stack}`);
    })
    .then(results => {
      // console.log(results);
      for (var i = 0; i < results.length; i++) {
        cpu_time[i] = results[i]["time"];
        cpu[i] = results[i]["value"];
      }

      // Get Temp Metrics
      influx
        .query("SELECT * FROM temp")
        .catch(err => {
          console.error(`Error retrieving data from Influx. ${err.stack}`);
        })
        .then(results => {
          for (var i = 0; i < results.length; i++) {
            temp_time[i] = results[i]["time"];
            temp[i] = results[i]["value"];
          }

          res.render("chart.hbs", {
            pageTitle: "Redfish Telemetry Client (Js)",
            cpu: cpu,
            temp: temp,
            cpu_time: cpu_time,
            temp_time: temp_time
          });
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
