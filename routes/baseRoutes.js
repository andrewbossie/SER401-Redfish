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
              	src: 'https://snapshot.raintank.io/dashboard-solo/snapshot/y7zwi2bZ7FcoTlB93WN7yWO4aMiz3pZb?from=1493369923321&to=1493377123321&panelId=4', 
              	label: 'Static Grafana Panel 1'
              },
              {
              	src: 'https://snapshot.raintank.io/dashboard-solo/snapshot/y7zwi2bZ7FcoTlB93WN7yWO4aMiz3pZb?from=1493369923321&to=1493377123321&panelId=4', 
              	label: 'Static Grafana Panel 2'
              },
              {
              	src: 'https://snapshot.raintank.io/dashboard-solo/snapshot/y7zwi2bZ7FcoTlB93WN7yWO4aMiz3pZb?from=1493369923321&to=1493377123321&panelId=4', 
              	label: 'Static Grafana Panel 3'
              },
              {
              	src: 'https://snapshot.raintank.io/dashboard-solo/snapshot/y7zwi2bZ7FcoTlB93WN7yWO4aMiz3pZb?from=1493369923321&to=1493377123321&panelId=4', 
              	label: 'Static Grafana Panel 4'
              }
           ]
       });
    });
}