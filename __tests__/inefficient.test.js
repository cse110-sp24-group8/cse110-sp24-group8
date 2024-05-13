import { complexFunction } from "../src/scripts/inefficient_code";

describe('complexFunction', () => {
    test('returns double the number when the number is between 11 and 19', () => {
        expect(complexFunction(11)).toBe(22);
        expect(complexFunction(15)).toBe(30);
        expect(complexFunction(19)).toBe(38);
    });
});