/*
* Retrieves a given metric from a given tray (if tray is applicable)
* and returns the metric in [timestamp, metric] format.
*/
let getMetric = (metricValues, metric, tray) => {
  let timeAndMetric = [];
  for (var i = 0; i < metricValues.length; i++) {
    if (
      tray &&
      metricValues[i].MetricProperty.includes(`Tray_${tray}`) &&
      metricValues[i].MemberID === metric
    ) {
      timeAndMetric.push(metricValues[i].TimeStamp);
      timeAndMetric.push(metricValues[i].MetricValue);
    }
  }
  return timeAndMetric;
};

let mockupMetricReport = {
  "@Redfish.Copyright":
    "Copyright 2014-2016 Distributed Management Task Force, Inc. (DMTF). All rights reserved.",
  "@odata.context": "/redfish/v1/$metadata#MetricReport.MetricReport",
  "@odata.type": "#MetricReport.v1_0_0.MetricReport",
  "@odata.id": "/redfish/v1/TelemetryService/MetricReports/CPUMetrics",
  Id: "CPUMetrics",
  Name: "CPUMetrics",
  EventTimestamp: "2018-10-25 19:40:32.546420",
  MetricReportDefinition: {
    "@odata.id":
      "/redfish/v1/TelemetryService/MetricReportDefinitions/CPUMetrics"
  },
  MetricValues: [
    {
      MemberID: "CPUPeakUtil",
      MetricValue: "20",
      TimeStamp: "20181110T142504-0500",
      MetricProperty: "/redfish/v1/Chassis/Tray_1/CPU/CPUControl/1/CPUUtil"
    },
    {
      MemberID: "CPUPeakDuration",
      MetricValue: "5",
      TimeStamp: "20181110T142504-0500",
      MetricProperty: "/redfish/v1/Chassis/Tray_1/CPU/CPUControl/1/CPUUtil"
    },
    {
      MemberID: "CPUPeakStartTime",
      MetricValue: "1",
      TimeStamp: "20181110T142504-0500",
      MetricProperty: "/redfish/v1/Chassis/Tray_1/CPU/CPUControl/1/CPUUtil"
    },
    {
      MemberID: "CPUPercentUtil",
      MetricValue: "11",
      TimeStamp: "2018-11-18T22:22:52.865Z",
      MetricProperty: "/redfish/v1/Chassis/Tray_1/CPU/CPUControl/1/CPUUtil"
    },
    {
      MemberID: "CPUPercentUtil",
      MetricValue: "67",
      TimeStamp: "2018-11-18T22:22:53.832Z",
      MetricProperty: "/redfish/v1/Chassis/Tray_1/CPU/CPUControl/3/CPUUtil"
    },
    {
      MemberID: "CPUPercentUtil",
      MetricValue: "71",
      TimeStamp: "2018-11-18T22:22:53.861Z",
      MetricProperty: "/redfish/v1/Chassis/Tray_1/CPU/CPUControl/2/CPUUtil"
    }
  ]
};

module.exports = {
  getMetric,
  mockupMetricReport
};
