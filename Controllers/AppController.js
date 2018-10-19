const keys = require("../config/keys");

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
          fields: { value: Math.random() * 100 }
        }
      ],
      {
        database: "test",
        precision: "s"
      }
    )
    .catch(error => {
      console.error(`Error writing data to Influx. ${err.stack}`);
    });
};
