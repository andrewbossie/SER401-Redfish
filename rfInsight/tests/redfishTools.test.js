const rTools = require("../resources/js/redfishTools");

const mockup = rTools.mockupMetricReport;

test("Returns filled object", () => {
   expect(rTools.getMetric(mockup.MetricValues, "CPUPeakUtil", 1, 1)).toEqual({
      MemberID: "CPUPeakUtil",
      MetricValue: "20",
      TimeStamp: "20181110T142504-0500",
      num: 1
   });
});

test("Returns filled object", () => {
   expect(
      rTools.getMetric(mockup.MetricValues, "CPUPercentUtil", 1, 3)
   ).toEqual({
      MemberID: "CPUPercentUtil",
      MetricValue: "67",
      TimeStamp: "2018-11-18T22:22:53.832Z",
      num: 3
   });
});

test("Throws could not get requested metric!", () => {
   expect(() => {
      rTools.getMetric(mockup.MetricValues, "CPU", 1, 0);
   }).toThrow("Could not get requested metric!");
});

test("Throws could not get requested metric!", () => {
   expect(() => {
      rTools.getMetric(mockup.MetricValues, "CPUPercentUtil", 1, 4);
   }).toThrow("Could not get requested metric!");
});
