# SER401-Redfish

## Capstone for SER401 - Redfish Telemetry Client

## Running the application (development)

### 1. Install Node.js

https://nodejs.org/en/ - Navigate here and download and install the LTS version
(10.15.1 at this time).
This will install both Node as well as npm, the package manager that will be needed
to install other packages used by the application.

### 2. Download Git repository

`git pull https://github.com/andrewbossie/SER401-Redfish.git`

- Navigate to project directory (cd ./SER401-Redfish)
- Run `npm install` to install all necessary packages

### 3. Run application

- Start up the Redfish Mockup Server and ensure it's running on port 8001.
- Navigate to Node project root directory and run `node index.js`.
- Navigate to `http://localhost:8080` in browser.

### NOTE

- Application will soon be configured for Sailfish.
- At this time, InfluxDB is not receiving data from the application, therefore
  the Grafana panels will be empty.

## Code Styling Guidelines

- Indentation is done with 3 spaces
- End necessary lines of javascript with a semicolon
- Opening curly braces go at the end of the same line (minus json arrays)
- All If/Else blocks have curly braces
- Use double quotes over single quotes when possible
