import { ensureDisjointTypes } from "./set";

describe("set", () => {
  describe("ensureDisjointTypes", () => {
    test("returns true if types and weaknesses are disjoint", () => {
      const types = ["Electric"];
      const weaknesses = ["Ground"];
      expect(ensureDisjointTypes(types, weaknesses)).toBe(true);
    });

    test("returns false if types and weaknesses are not disjoint", () => {
      const types = ["Electric"];
      const weaknesses = ["Electric", "Ground"];
      expect(ensureDisjointTypes(types, weaknesses)).toBe(false);
    });
  });
});
