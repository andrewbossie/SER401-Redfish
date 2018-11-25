var config = {
  RedFishData: {
    // Path to the redfish directory that will be served.
    // This should be a copy of the original directory since
    // the data will be modified.
    path: "../../../DCSimTools/Redfish-Mockup-Server/redfish"
  },
  MockupData: {
    // This is an array of all of the MetricIDs to be modified
    // with patterns.
    MockupPatterns: [
      {
        name: "Sawtooth CPU(1) Percent",
        // Path within the above redfish directory
        path: "/v1/TelemetryService/MetricReports/CPUMetrics/",
        // The time, in seconds, between changes. This is multiplied
        // into miliseconds, so values can be less than 1 second (so
        // .5 would be 500 miliseconds). Keep in mind that for each
        // iteration the json file in the redfish directory is fully
        // read and then written back out.
        timedelay: 2,
        // The pattern in the PatternFuncs.js file. Currently, these
        // are:
        //
        // 'sawtooth' goes from <min> to <max> in <step> increments
        //    and then wraps back to <min>
        //
        // 'pingpong' goes from <min> to <max> and then reverses and
        //    goes back to <min> in <step> increments
        //
        // 'fullrand' a random value between <min> and <max>
        //
        // 'steprand' a random value no greater than <step> away from
        //    the current value. For instance, if step is 5 and the current
        //    value is 50, the next value could be any integer between 45
        //    and 55.
        pattern: "sawtooth",
        // These can be set if needed. Default values of "min" and "max"
        // are 0 and 100 to simulate a percentage. Default value of
        // "step" is 1.

        //"min": 45,
        //"max": 95,
        //"step": 5,

        // This is the template for the MetricValue key from the actual
        // RedFish json file. Currently, two values get replaced:
        //
        // #value: Will get replaced by the next pattern value every time
        // #timestamp: Will get replaced by the current ISO date
        //
        // This can be used for multiple MetricProperty values.
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
        timedelay: 3,
        pattern: "pingpong",
        min: 70,
        max: 80,
        step: 3,
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
        timedelay: 5,
        pattern: "fullrand",
        min: 45,
        max: 90,
        MetricValueTemplate: {
          MemberID: "CPUPercentUtil",
          MetricValue: "#value",
          TimeStamp: "#timestamp",
          MetricProperty: "/redfish/v1/Chassis/Tray_1/CPU/CPUControl/3/CPUUtil"
        }
      }
    ]
  }
};

module.exports = config;
