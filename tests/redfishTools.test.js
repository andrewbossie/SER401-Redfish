const rTools = require("../Resources/js/redfishTools");

const mockup = rTools.mockupMetricReport;

test("Returns ['20181110T142504-0500', '20']", () => {
  expect(rTools.getMetric(mockup.MetricValues, "CPUPeakUtil", 1)).toEqual([
    "20181110T142504-0500",
    "20"
  ]);
});
