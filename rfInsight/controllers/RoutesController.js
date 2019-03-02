const request = require("request");
const fs = require("fs");
const _ = require("lodash");

const childProcess = require("child_process");
const config = require("../config/config");
var generatorProcess = { process: null, perc: 0 }; //Global reference to generator child process

let options = {
  host: "http://127.0.0.1:8001",
  redfish_defs: "/redfish/v1/TelemetryService/MetricReportDefinitions"
};

let def_path = `${options.host}${options.redfish_defs}`;

// Render Static Panels in Grafana
exports.getPanels = function(req, res) {
  res.render("index.hbs", {
    pageTitle: "Redfish Insight",
    currentYear: new Date().getFullYear()
  });
};

exports.getDefinitionCollection = function(req, res) {
  request(
    {
      url: def_path,
      json: true
    },
    (error, response, body) => {
      if (!body) {
        res.status(404);
        res.json({
          error: "Could not retrieve metrics"
        });
      } else if (error) {
        console.log(error);
      } else {
        let metrics = [];
        for (var i = 0; i < body.Members.length; i++) {
          let uri = body.Members[i]["@odata.id"];
          metrics.push(uri.split("/")[uri.split("/").length - 1]);
        }
        res.json(metrics);
      }
    }
  );
};

// Currently being used for the landing page.
exports.getAvailableMetrics = function(req, res) {
  request(
    {
      url: def_path,
      json: true
    },
    (error, response, body) => {
      if (!body) {
        res.status(404);
        res.json({
          error: "Could not retrieve metrics"
        });
      } else if (error) {
        console.log(error);
      } else {
        let metrics = [];
        for (var i = 0; i < body.Members.length; i++) {
          let uri = body.Members[i]["@odata.id"];
          metrics.push(uri.substr(53, uri.length));
        }
        // console.log(metrics);
        res.render("landing.hbs", {
          pageTitle: "Redfish Insight",
          metrics: metrics
        });
      }
    }
  );
};

// Route handler for /metrics/:metric
// Note: the mockup server isn't sending proper HTTP responses for
// bad requests. This is why !body is checked after the request is made.
exports.getMetric = function(req, res) {
  let metric = req.params.metric;
  // console.log(typeof metric);
  request(
    {
      url: `${def_path}/${metric}`,
      json: true
    },
    (error, response, body) => {
      if (!body) {
        res.status(404);
        res.json({
          error: "Metric does not exist",
          metric: metric
        });
      } else if (error) {
        console.log(error);
      } else {
        console.log(body);
        res.json(body);
      }
    }
  );
};

//Route handler for /dataGenerator
exports.getDataGenerator = function(req, res) {
  res.render("dataGeneratorUI.hbs", {
    configPath:
      "Config files located at: " +
      fs.realpathSync("./resources/js/dataGenerator"),
    currentYear: new Date().getFullYear(),
    pageTitle: "Redfish Modeler"
  });
};

exports.generateMockData = function(req, res) {
  var q = [];

  //for ajax call to get percentage complete
  if (req.query.perc) {
    res.writeHead(200, { "Content-Type": "application/json" });
    if (generatorProcess.process != null) {
      res.end("" + generatorProcess.perc);
    } else {
      res.end("100");
    }
    return;
  }

  //if not a percentage call, start the generator
  if (req.query.time) q.push("-t", req.query.time);
  if (req.query.config) q.push("-c", req.query.config);
  if (req.query.interval) q.push("-i", req.query.interval);
  function generate(path, callback) {
    generatorProcess.process = childProcess.fork("rfmockdatacreator.js", q, {
      cwd: path
    });

    generatorProcess.perc = 0;
    var invoked = false;

    // listen for errors
    generatorProcess.process.on("error", function(err) {
      if (invoked) return;
      invoked = true;
      callback(err);
    });

    //update perc variable when received from child process
    generatorProcess.process.on("message", msg => {
      generatorProcess.perc = parseInt(msg);
    });

    // execute the callback
    generatorProcess.process.on("exit", function(code) {
      generatorProcess.process = null;
      if (invoked) return;
      invoked = true;
      var err = code === 0 ? null : new Error("exit code " + code);
      callback(err);
    });
  }

  generate("./resources/js/dataGenerator/", function(err) {
    if (!err) {
      res.download("./resources/js/dataGenerator/output.csv");
    } else {
      console.log(err);
    }
  });
};

exports.postRedfishHost = function(req, res) {
  console.log(`Host POST: ${JSON.stringify(req.body, undefined, 3)}`);
  let body = req.body.payload;
  if (!_.isEmpty(body)) {
    let host = body.host;
    updateHost(host);
    console.log(host);
    res.json(body);
  } else {
    res.json({
      error: "POST body should only contain attribute 'host'"
    });
  }
};

exports.postSelectedMetrics = function(req, res) {
  console.log(`Metrics POST: ${JSON.stringify(req.body, undefined, 3)}`);
  let selectedMetrics = req.body;
  if (!_.isEmpty(selectedMetrics.payload)) {
    // let metricReport = selectedMetrics.from;
    // let metrics = selectedMetrics.metrics;
    _.forOwn(selectedMetrics.payload, (val, key) => {
      // TODO: Handle each key
      // TODO: fix updateConfig to adhere
      patchMetricToEnabled(key);
    });

    updateConfig(selectedMetrics.payload);

    res.json(selectedMetrics);
  } else {
    res.json({
      error: "Bad Format"
    });
  }
};

const updateConfig = newSelection => {
  fs.readFile("metrics_config.json", "utf8", (err, data) => {
    if (err) {
      throw err;
    } else {
      configData = JSON.parse(data);
      // !configData.enabledReports.includes(newSelection.from) &&
      //   configData.enabledReports.push(newSelection.from) &&
      //   configData.selections.push(newSelection);
      _.forOwn(newSelection, (val, key) => {
        !configData.enabledReports.includes(key) &&
          configData.enabledReports.push(key) &&
          configData.selections.push({
            from: key,
            metrics: val
          });
      });
      fs.writeFile(
        "metrics_config.json",
        JSON.stringify(configData, undefined, 3),
        "utf8",
        (err, data) => {
          if (err) {
            console.log(err);
          }
        }
      );
    }
  });
};

exports.postSubType = function(req, res) {
  console.log(`Sub type POST: ${JSON.stringify(req.body, undefined, 3)}`);
  let selectedSubType = req.body;
  if (
    selectedSubType.type &&
    ["sse", "sub", "poll"].includes(selectedSubType.type)
  ) {
    // TODO: Set up connection to Redfish accordingly
    if (selectedSubType.type === "sub") {
      subscribeToEvents();
    }
    // TODO: Update metrics_config.json
    updateSubType(selectedSubType.type);
    res.json(selectedSubType);
  } else {
    res.json({
      error:
        "POST body must include property 'type'. Acceptable values: poll, sse, or sub"
    });
  }
};

exports.handleEventIn = function(req, res) {
  console.log("Received a metric report from Redfish service.");
  res.json(req.body);
};

const subscribeToEvents = () => {
  request.post(
    {
      url: `http://localhost:8001/redfish/v1/EventService/Subscriptions`,
      json: true,
      body: {
        EventFormatType: "MetricReport",
        SubscriptionType: "RedfishEvent",
        Destination: "http://localhost:8080/api/event_in"
      }
    },
    (error, response, body) => {
      if (error) {
        console.log(error);
      }
      console.log(response);
    }
  );
};

exports.getCurrentConfig = function(req, res) {
  let configData;

  fs.readFile("metrics_config.json", "utf8", (err, data) => {
    if (err) {
      throw err;
    } else {
      configData = JSON.parse(data);
      res.json(configData);
    }
  });
};

const patchMetricToEnabled = report => {
  request.patch(
    {
      url: `${def_path}/${report}`,
      json: true,
      body: {
        // This is temporary and will need to be changed upon schema update.
        // Status.State is read-only.
        MetricReportDefinitionEnabled: true
      }
    },
    (error, response, body) => {
      console.log(response);
    }
  );
};

const saveSelectionToDisk = selection => {
  let currentConfiguration = JSON.stringify(selection, undefined, 3);

  fs.writeFile(
    "metrics_config.json",
    currentConfiguration,
    "utf8",
    (err, data) => {
      if (err) {
        console.log(err);
      }
    }
  );
};

const updateSubType = newSubType => {
  fs.readFile("metrics_config.json", "utf8", (err, data) => {
    if (err) {
      throw err;
    } else {
      configData = JSON.parse(data);
      configData.sub_method = newSubType;
      fs.writeFile(
        "metrics_config.json",
        JSON.stringify(configData, undefined, 3),
        "utf8",
        err => {
          if (err) {
            console.log(err);
          }
        }
      );
    }
  });
};

const updateHost = host => {
  options.host = host;
  def_path = `${options.host}${options.redfish_defs}`;
  // fs.readFile("metrics_config.json", "utf8", (err, data) => {
  //   if (err) {
  //     throw err;
  //   } else {
  //     configData = JSON.parse(data);
  //     configData.ip = ip;
  //     fs.writeFile(
  //       "metrics_config.json",
  //       JSON.stringify(configData, undefined, 3),
  //       "utf8",
  //       err => {
  //         if (err) {
  //           console.log(err);
  //         }
  //       }
  //     );
  //   }
  // });
};
