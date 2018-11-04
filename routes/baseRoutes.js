const express = require("express");
const path = require("path");
const app_controller = require("../Controllers/AppController");

module.exports = app => {
  app.use(express.static("./Resources"));

  app.get("/", (req, res) => {
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
        }
      ]
    });
  });
  app.get('/charts', (req, res) =>{
    v = app_controller.getInfluxData();
    console.log(v);
    res.render("chart.hbs", {
        pageTitle: "Redfish Telemetry Client (Js)",
        values: v
    });
  })
};
