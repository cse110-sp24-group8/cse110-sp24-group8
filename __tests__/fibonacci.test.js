import { fibonacci } from "../src/scripts/fibonacci"// Adjust the path as necessary

describe('Fibonacci Function', () => {
  test('calculates correct Fibonacci value for 1', () => {
    expect(fibonacci(1)).toBe(1);
  });

  test('calculates correct Fibonacci value for 2', () => {
    expect(fibonacci(2)).toBe(1);
  });

  test('calculates correct Fibonacci value for 10', () => {
    expect(fibonacci(10)).toBe(55);
  });

});
