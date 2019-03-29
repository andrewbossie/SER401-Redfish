const Influx = require("influx");

const config = JSON.parse(require("../metrics_config.json"));

const influx = new Influx.InfluxDB({
  host: "localhost:8086",
  database: "metrics",
  username: "admin",
  password: "admin",

  /*
  * The schema will need to be dynamically created based on the metrics
  * that a user selects in the beginning (prior to hitting 'start').
  */
  schema: [
    {
      measurement: "",
      fields: { value: Influx.FieldType.FLOAT },
      tags: [""]
    }
  ]
});
