const rTools = require("../Resources/js/redfishTools");

const mockup = rTools.mockupMetricReport;

test("Returns ['20181110T142504-0500', '20']", () => {
  expect(rTools.getMetric(mockup.MetricValues, "CPUPeakUtil", 1)).toEqual([
    "20181110T142504-0500",
    "20"
  ]);
});

test("Returns ['20181110T142504-0500', '1']", () => {
  expect(rTools.getMetric(mockup.MetricValues, "CPUPeakStartTime", 1)).toEqual([
    "20181110T142504-0500",
    "1"
  ]);
});

test("Throws could not get requested metric!", () => {
  expect(() => {
    rTools.getMetric(mockup.MetricValues, "CPU", 1);
  }).toThrow("Could not get requested metric!");
});

// test("Returns []", () => {
//   expect(rTools.getMetric(mockup.MetricValues, "CPU", 1)).toEqual([]);
// });
//
// test("Returns []", () => {
//   expect(rTools.getMetric(mockup.MetricValues, "CPUPeakUtil", 0)).toEqual([]);
// });
