const express = require("express");
const path = require("path");


module.exports = (app) => {

    app.use(express.static('./Resources'));

    app.get('/', (req, res) => {
       res.render('index.hbs', {
           pageTitle: 'Redfish Telemetry Client',
           currentYear: new Date().getFullYear(),
           panels: [
              {
              	src: 'http://52.37.217.87:3000/d/uiNmWixmz/randomdata?refresh=5s&panelId=2&fullscreen&orgId=1', 
              	label: 'Static Grafana Panel 1'
              },
              {
              	src: 'http://52.37.217.87:3000/d/uiNmWixmz/randomdata?refresh=5s&panelId=2&fullscreen&orgId=1', 
          		label: 'Static Grafana Panel 2'
              },
              {
              	src: 'http://52.37.217.87:3000/d/uiNmWixmz/randomdata?refresh=5s&panelId=2&fullscreen&orgId=1', 
              	label: 'Static Grafana Panel 3'
              },
              {
              	src: 'http://52.37.217.87:3000/d/uiNmWixmz/randomdata?refresh=5s&panelId=2&fullscreen&orgId=1', 
              	label: 'Static Grafana Panel 4'
              }
           ]
       });
    });
}