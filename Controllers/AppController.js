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

let updateCPUUtil = () => {
  request(
    {
      url:
        "http://localhost:8000/redfish/v1/TelemetryService/MetricReports/CPUMetrics",
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
                console.log(now);
                console.log(date);
              metrics.cpuUtil.timestamp = Influx.toNanoDate(date);
              metrics.cpuUtil.metric = body.MetricValues[i].MetricValue;
            }
              increment = increment + 1;
          }
        }
      }
    }
  );
};
var increment = 1;
setInterval(updateCPUUtil, 1000);

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

exports.getInfluxData = function(){
    influx.query(
        'SELECT * FROM cpu'
    ).catch(err=>{
        console.error(`Error retrieving data from Influx. ${err.stack}`);
    }).then(results=> {
        return results
        // console.log(results);
        // response.status(200).json(results)
    });

};
/*
* Note: Redfish API Specification DateTime values are in ISO 8601 "extended"
*  format: ex. "2017-11-23T17:17:42-0600"
*
*   Current RedishMockupServer metric reports contain format
*     "20161108T142504-0500"
*/
