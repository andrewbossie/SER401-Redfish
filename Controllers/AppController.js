const keys = require("../config/keys");
const request = require("request");

// Get CPU data

let metrics = {
  cpuUtil: {}
};

let updateCPUUtil = () => {
  request(
    {
      url:
        "http://localhost:8000/redfish/v1/TelemetryService/MetricReports/CPUMetrics",
      json: true
    },
    (error, response, body) => {
      if (error) {
        callback("Unable to connect to server.");
      } else {
        console.log(body.MetricValues);
        if (body.MetricValues) {
          for (var i = 0; i < body.MetricValues.length; i++) {
            if (body.MetricValues[i].MemberID == "CPUPercentUtil") {
              // This timestamp needs to be converted before going to Influx.
              metrics.cpuUtil.timestamp = body.MetricValues[i].TimeStamp;
              metrics.cpuUtil.metric = body.MetricValues[i].MetricValue;
            }
          }
        }
      }
    }
  );
};

// updateCPUUtil();
setInterval(updateCPUUtil, 1000);

// InfluxDB Connection
const Influx = require("influx");

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

exports.writeDataTest = function() {
  influx
    .writePoints(
      [
        {
          measurement: "cpu",
          tags: { host: "serverA" },
          fields: { value: metrics.cpuUtil.metric },
          timestamp: metrics.cpuUtil.timestamp
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
