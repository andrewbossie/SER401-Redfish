const express = require("express");
const hbs = require("hbs");

const app = express();

hbs.registerPartials(__dirname + '/views/partials');
app.set('view engine', 'hbs');

app.get('/', (req, res) => {
   res.render('index.hbs', {
       pageTitle: 'Redfish Telemetry Client',
       currentYear: new Date().getFullYear()
   });
});

app.listen(8080);
