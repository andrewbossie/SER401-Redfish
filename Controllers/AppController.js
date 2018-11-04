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
          fields: { value: Math.random() * 100 }
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
