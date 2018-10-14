const express = require("express");
const hbs = require("hbs");
const baseRoutes = require("./routes/baseRoutes");
const keys = require("./config/keys");

/**
 * Testing InfluxDB
 **/
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

var writeDataTest = function() {
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

setInterval(writeDataTest, 5000);

const app = express();
hbs.registerPartials(__dirname + "/views/partials");
app.set("view engine", "hbs");

baseRoutes(app);

app.listen(8080);
