var config = {
   "RedFishData": {
      "path": "../../redfish"
   },
   "MockupData": {
      "MockupPatterns": [
         {
            "name": "Sawtooth CPU Percent",
            "path": "/v1/TelemetryService/MetricReports/CPUMetrics/",
            "timedelay": 2,
            "pattern": "sawtooth",
            "metricvaluetemplate": {
	       "MemberID": "CPUPercentUtil",
	       "MetricValue": "#value",
	       "TimeStamp": "#timestamp",
	       "MetricProperty": "/redfish/v1/Chassis/Tray_1/CPU/CPUControl/1/CPUUtil"
            }
         },
         /*
         {
            "name": "Pingpong CPU Temp",
            "path": "/v1/TelemetryService/MetricReports/CPUMetrics/",
            "timedelay": 5,
            "pattern": "pingpong",
            "min": 45,
            "max": 95,
            "metricvaluetemplate": {
	       "MemberID": "CPUPercentUtil",
	       "MetricValue": "#value",
	       "TimeStamp": "#timestamp",
	       "MetricProperty": "/redfish/v1/Chassis/Tray_1/CPU/CPUControl/1/CPUUtil"
            }
         }
         */
      ]
   }
}

module.exports = config;
