# `jsMockServer` Overview

`jsMockServer` is a set of scripts and patterns to create and optionally serve mockup [RedFish][RedFish] data. Note that it is *not* a full RedFish implementation. It uses templates from the `/redfish/v1/TelemetryService` portion of the RedFish API and a set of defined patterns to create mock data for visualization or other test cases.

# `jsmockserver`

The `jsmockserver` script without any arguments reads from the `config.js` file and writes out mock data according to the specifications listed in that file to an existing RedFish directory. Specifically, it modifies the files under the `TelemetryService` directory to simulate incoming telemetry data.

## Usage

```
$ node jsmockserver \[-s\] \[-c \<config file\>\]

-s         Starts a server on port 8001 to serve up the /redfish/v1/TelemetryService directory
-c <file>  A config file other than ./config.js
```

# `jsmockdatacreator`

The `jsmockdatacreator` script uses the same `config.js` file but instead of writing to or serving up the RedFish directory it creates a CSV file suitable for replaying with the current Python RedFish mock server distributed by the DMTF organization.

## Usage

```
$ node jsmockdatacreator \[-c \<config file\>\] \[-t\] \[-o\]

-c <file>  A config file other than ./config.js
-t         The number of iterations to calculate
-o         The output CSV file
```

# `config.js`

This is the main config file for the set of scripts.

```json
var config = {
  RedFishData: {
    path: "../../redfish"
  },
  MockupData: {
    MockupPatterns: [
      {
        name: "Sawtooth CPU(1) Percent",
        path: "/v1/TelemetryService/MetricReports/CPUMetrics/",
        timedelay: 3,
        pattern: "sawtooth",
        MetricValueTemplate: {
          MemberID: "CPUPercentUtil",
          MetricValue: "#value",
          TimeStamp: "#timestamp",
          MetricProperty: "/redfish/v1/Chassis/Tray_1/CPU/CPUControl/1/CPUUtil"
        }
      },
      {
        name: "Pingpong CPU(2) Percent",
        path: "/v1/TelemetryService/MetricReports/CPUMetrics/",
        timedelay: 5,
        pattern: "fullrand",
        min: 70,
        max: 80,
        step: 1,
        MetricValueTemplate: {
          MemberID: "CPUPercentUtil",
          MetricValue: "#value",
          TimeStamp: "#timestamp",
          MetricProperty: "/redfish/v1/Chassis/Tray_1/CPU/CPUControl/2/CPUUtil"
        }
      },
      {
        name: "Random CPU(3) Percent",
        path: "/v1/TelemetryService/MetricReports/CPUMetrics/",
        timedelay: 10,
        pattern: "fullrand",
        min: 45,
        max: 90,
        MetricValueTemplate: {
          MemberID: "CPUPercentUtil",
          MetricValue: "#value",
          TimeStamp: "#timestamp",
          MetricProperty: "/redfish/v1/Chassis/Tray_1/CPU/CPUControl/3/CPUUtil"
        }
      },
		{
        name: "Random Memory Util",
        path: "/v1/TelemetryService/MetricReports/MemoryMetrics/",
        timedelay: 1,
        pattern: "fullrand",
        min: 45,
        max: 90,
        MetricValueTemplate: {
          MemberID: "MemoryPercentUtil",
          MetricValue: "#value",
          TimeStamp: "#timestamp",
          MetricProperty: "/redfish/v1/Chassis/Tray_1/Memory/MemoryControl/1/MemoryUtil"
        }
	  }
    ]
  }
};

module.exports = config;
```
