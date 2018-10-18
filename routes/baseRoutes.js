const express = require("express");
const path = require("path");


module.exports = (app) => {

    app.use(express.static('./Resources'));

    app.get('/', (req, res) => {
       res.render('index.hbs', {
           pageTitle: 'Redfish Telemetry Client',
           currentYear: new Date().getFullYear()
       });
    });
}