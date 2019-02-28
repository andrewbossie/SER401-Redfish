const PFuncs = require("../PatternFuncs");
const util = require("util");

afterEach(() => {});

describe("Sawtooth behaviour", () => {
   test("sawtooth wrap", () => {
      var pfuncs = new PFuncs();

      pfuncs.value = 99;
      pfuncs.sawtooth();
      pfuncs.sawtooth();

      expect(pfuncs.value).toBe(0);
   });

   test("sawtooth wrap with positive step > 1", () => {
      var pfuncs = new PFuncs(0, 100, 4);

      pfuncs.value = 99;
      pfuncs.sawtooth();

      expect(pfuncs.value).toBe(2);
   });

   test("sawtooth wrap with negative step < 1", () => {
      var pfuncs = new PFuncs(0, 100, -4);

      pfuncs.value = 3;
      pfuncs.sawtooth();

      expect(pfuncs.value).toBe(100);
   });
});

//  min  max  step last len  lund ldef hdef hund
describe.each([
   [40, 80, 1, 56, 41, 39, 40, 80, 81],
   [40, 80, 3, 47, 41, 39, 40, 80, 81],
   [-10, 10, 1, 3, 21, -11, -10, 10, 11],
   [40, 80, -1, 65, 41, 39, 40, 80, 81]
])(
   ".sawtooth(min, max, step)",
   (min, max, step, last, len, lund, ldef, hdef, hund) => {
      test(`Min: ${min} Max: ${max} Step: ${step}`, () => {
         var pfuncs = new PFuncs(min, max, step);
         var targets = {};

         for (var loop = 0; loop < 1000; loop++) {
            var res = pfuncs.sawtooth();
            if (!targets[res]) {
               targets[res] = 1;
            } else {
               targets[res]++;
            }
         }

         expect(pfuncs.value).toBe(last);
         expect(Object.keys(targets).length).toBe(len);
         expect(targets[lund]).toBeUndefined();
         expect(targets[ldef]).toBeDefined();
         expect(targets[hdef]).toBeDefined();
         expect(targets[hund]).toBeUndefined();
      });
   }
);

describe("Pingpong behaviour", () => {
   test("pingpong wrap", () => {
      var pfuncs = new PFuncs();

      pfuncs.value = 99;
      pfuncs.isRev = false;

      pfuncs.pingpong();
      expect(pfuncs.isRev).toBeFalsy();
      expect(pfuncs.value).toBe(100);

      pfuncs.pingpong();
      expect(pfuncs.isRev).toBeTruthy();
      expect(pfuncs.value).toBe(99);

      pfuncs.value = 1;
      pfuncs.isRev = true;

      pfuncs.pingpong();
      expect(pfuncs.isRev).toBeTruthy();
      expect(pfuncs.value).toBe(0);

      pfuncs.pingpong();
      expect(pfuncs.isRev).toBeFalsy();
      expect(pfuncs.value).toBe(1);

      expect(pfuncs.value).toBe(1);

      pfuncs = new PFuncs(50, 60, 3);

      pfuncs.value = 59;
      pfuncs.isRev = false;

      pfuncs.pingpong();
      expect(pfuncs.isRev).toBeTruthy();
      expect(pfuncs.value).toBe(58);

      pfuncs.value = 51;
      pfuncs.isRev = true;

      pfuncs.pingpong();
      expect(pfuncs.isRev).toBeFalsy();
      expect(pfuncs.value).toBe(52);
   });
});

//  min  max  step last len  lund ldef hdef hund
describe.each([
   [0, 100, 1, 0, 101, -1, 0, 100, 101],
   [40, 80, 1, 80, 41, 39, 40, 80, 81],
   [40, 50, 3, 40, 11, 39, 40, 50, 51],
   [-10, 10, 1, -10, 21, -11, -10, 10, 11],
   [40, 44, -1, 40, 5, 39, 40, 44, 45]
])(
   ".pingpong(min, max, step)",
   (min, max, step, last, len, lund, ldef, hdef, hund) => {
      test(`Min: ${min} Max: ${max} Step: ${step}`, () => {
         var pfuncs = new PFuncs(min, max, step);
         var targets = {};

         for (var loop = 0; loop < 1000; loop++) {
            var res = pfuncs.pingpong();
            if (!targets[res]) {
               targets[res] = 1;
            } else {
               targets[res]++;
            }
         }

         expect(pfuncs.value).toBe(last);
         expect(Object.keys(targets).length).toBe(len);
         expect(targets[lund]).toBeUndefined();
         expect(targets[ldef]).toBeDefined();
         expect(targets[hdef]).toBeDefined();
         expect(targets[hund]).toBeUndefined();
      });
   }
);

describe("Fullrand behaviour", () => {
   test("All values hit", () => {
      var pfuncs = new PFuncs(0, 100);
      var targets = {};

      for (var loop = 0; loop < 10000; loop++) {
         var res = pfuncs.fullrand();
         if (!targets[res]) {
            targets[res] = 1;
         } else {
            targets[res]++;
         }
      }

      expect(targets[-1]).toBeUndefined();

      for (var val = 0; val < 100; val++) {
         expect(targets[val]).toBeDefined();
      }

      expect(targets[101]).toBeUndefined();
   });

   test("Even distribution", () => {
      var pfuncs = new PFuncs(1, 6);
      var targets = {};

      for (var loop = 0; loop < 6000; loop++) {
         var res = pfuncs.fullrand();
         if (!targets[res]) {
            targets[res] = 1;
         } else {
            targets[res]++;
         }
      }

      for (var val = 1; val < 6; val++) {
         expect(targets[val]).toBeGreaterThan(900);
         expect(targets[val]).toBeLessThan(1100);
      }
   });
});

describe("Steprand behaviour", () => {
   test("All values hit", () => {
      var pfuncs = new PFuncs(0, 100, 5);
      var targets = {};

      for (var loop = 0; loop < 10000; loop++) {
         pfuncs.value = 50;
         var res = pfuncs.steprand();
         if (!targets[res]) {
            targets[res] = 1;
         } else {
            targets[res]++;
         }
      }

      expect(targets[44]).toBeUndefined();

      for (var val = 45; val < 55; val++) {
         expect(targets[val]).toBeDefined();
      }

      expect(targets[56]).toBeUndefined();
   });

   test("Even distribution", () => {
      var pfuncs = new PFuncs(0, 100, 5);
      var targets = {};

      for (var loop = 0; loop < 10000; loop++) {
         pfuncs.value = 50;
         var res = pfuncs.steprand();
         if (!targets[res]) {
            targets[res] = 1;
         } else {
            targets[res]++;
         }
      }

      for (var val = 45; val < 55; val++) {
         expect(targets[val]).toBeGreaterThan(800);
         expect(targets[val]).toBeLessThan(1200);
      }
   });
});
