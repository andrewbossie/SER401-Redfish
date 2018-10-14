const path = require('path');

var appDirectory = path.dirname(require.main.filename);

module.exports = (app) => {

    app.get('/', (req, res) => {
       res.render('index.hbs', {
           pageTitle: 'Redfish Telemetry Client',
           currentYear: new Date().getFullYear()
       });
    });
    
    app.get('/help', (req, res) => {
       res.sendFile("/views/help.html", {
           root: appDirectory
       });
    });
}