const util = require("../Resources/js/util");

// Valid input, needs conversion
test("Converts 20161108T142504-0500 to 2016-11-08T14:25:04-0500", () => {
   expect(util.convertToIsoDate("20161108T142504-0500")).toBe(
      "2016-11-08T14:25:04-0500"
   );
});

// Valid input, no conversion
test("Returns 2016-11-08T14:25:04-0500", () => {
   expect(util.convertToIsoDate("2016-11-08T14:25:04-0500")).toBe(
      "2016-11-08T14:25:04-0500"
   );
});

// Valid input, no conversion
test("Returns 2016-11-08T14:25:04.437Z", () => {
   expect(util.convertToIsoDate("2016-11-08T14:25:04.437Z")).toBe(
      "2016-11-08T14:25:04.437Z"
   );
});

// Invalid input
test("Throws Invalid timestamp format!", () => {
   expect(() => {
      util.convertToIsoDate("201611408T14:25:04-0500");
   }).toThrow("Invalid timestamp format!");
});
