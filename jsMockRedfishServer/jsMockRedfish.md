# `jsMockServer` Overview

`jsMockServer` is a set of scripts and patterns to create and optionally serve mockup [RedFish][RedFish] data. Note that it is *not* a full RedFish implementation. It uses templates from the `/redfish/v1/TelemetryService` portion of the RedFish API and a set of defined patterns to create mock data for visualization or other test cases.

# `rfmockserver`

The `rfmockserver` script without any arguments reads from the `config.js` file and writes out mock data according to the specifications listed in that file to an existing RedFish directory. Specifically, it modifies the files under the `TelemetryService` directory to simulate incoming telemetry data.

## Usage

```
$ node rfmockserver \[-s\] \[-c \<config file\>\]

-s         Starts a server on port 8001 to serve up the /redfish/v1/TelemetryService directory
-c <file>  A config file other than ./config.js
```

# `rfmockdatacreator`

The `rfmockdatacreator` script uses the same `config.js` file but instead of writing to or serving up the RedFish directory it creates a CSV file suitable for replaying with the current Python RedFish mock server distributed by the DMTF organization.

## Usage

```
$ node rfmockdatacreator \[-c \<config file\>\] \[-t\] \[-o\]

-c <file>  A config file other than ./config.js
-t         The number of iterations to calculate
-o         The output CSV file
```

# `config.js`

This is the main config file for the set of scripts. It is in JSON format in one large `config variable`.

## General format

```json
var config = {
  RedFishData: {
    path: "../../redfish"
  },
  MockupData: {
    MockupPatterns: [
    ]
  }
};

module.exports = config;
```

This is the main layout of the `jsMockServer` config file. Important bits:

1. `path:` The path to the top level `redfish` used as inputs to the scripts. This includes the initial `/redfish` portion of the path, so the the variable should resolve as `__path__/v1/…`.
1. `MockupPatterns:` A collection of patterns (described below) for use in the `jsMockServer` scripts. These will all be run in tandem on the same timeline.
1. `module.exports = config;` This is necessary in order for the main script to pull in the config file as a variable.

## Mockup Pattern JSON

```JSON
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
```

This is a sample pattern to use in the `MockupPatterns` array. Each one of these is a mockup pattern for a telemetry variable.

1. `name:` For identification purposes only, this is a name for this specific pattern.
1. `path:` The path in the RedFish API relative to the general `__path__` above for this specific telemetry pattern.
1. `timedelay:` The time in seconds between each new random number generated in the pattern.
1. `pattern:` Which specific pattern (discussed below) to use for this mockup.
1. `MetricValueTemplate:` The template for the specific metric for this mockup, generally pulled from a current `index.json` file in a `TelemetryService` directory. This will be used exactly as shown in the template except for two substitutions:
  1. `#value` will be replaced with the mockup value created by the script
  1. `#timestamp` will be replaced with the current timestamp in the script
1. There may be other variables needed within the pattern. These will be described within their pattern type.

## Patterns

The pattern in the `PatternFuncs.js` file. Currently, these are:

1. 'sawtooth' goes from `min` to `max` in `step:` increments and then wraps back to `min:`. Note that it still keeps the `step:` increment when it wraps, and it includes both the `min:` and `max:` number, so if the current value is 99, with the default `min:` and `max:` values and a `step:` of 5, the next value would be 3 (100, 0, 1, 2, 3).
  * `min:` defaults to 0
  * `max:` defaults to 100
  * `step:` defaults to 1
1. 'pingpong' goes from `min` to `max` and then reverses and goes back to `min` in `step` increments. This keeps the `step:` interval similarly to the `sawtooth` pattern, in that if the value going up is 98 and the `step:` is 5, the next value will be 97 (99, 100, 99, 98, 97).
  * `min:` defaults to 0
  * `max:` defaults to 100
  * `step:` defaults to 1
1. 'fullrand' a random value between `min:` and `max:`, inclusive.
  * `min:` defaults to 0
  * `max:` defaults to 100
1. 'steprand' a random value between `min:` and `max:` no greater than `step:` away from the current value. For instance, if `step:` is 5 and the current value is 50, the next value could be any integer between 45 and 55. This wraps similarly to the `sawtooth` pattern above.
  * `min:` defaults to 0
  * `max:` defaults to 100
  * `step:` defaults to 1

# Full sample config

```JSON
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
