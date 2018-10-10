
module.exports = (app) => {

    app.get('/', (req, res) => {
       res.render('index.hbs', {
           pageTitle: 'Redfish Telemetry Client',
           currentYear: new Date().getFullYear()
       });
    });
}