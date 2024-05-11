import { subtract } from "../src/subtract-code-to-test";

test("subtract 3 - 1 equal ", () => {
  expect(subtract(3, 1)).toBe(3);
});
