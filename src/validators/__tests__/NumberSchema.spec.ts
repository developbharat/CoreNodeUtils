import { NumberSchema } from "../NumberSchema";

describe("NumberSchema", () => {
  test(".min works", async () => {
    expect(await new NumberSchema().min(10).max(200).execute(12)).toBe(12);
    expect(() => new NumberSchema().min(20).execute(10)).rejects.toThrow();
  });

  test(".max fails", async () => {
    expect(await new NumberSchema().max(50).execute(15)).toBe(15);
    expect(() => new NumberSchema().max(20).execute(100)).rejects.toThrow();
  });

  test(".isPositive works", async () => {
    expect(await new NumberSchema().isPositive(false).execute(15)).toBe(15);
    expect(await new NumberSchema().isPositive(true).execute(0)).toBe(0);
    expect(() => new NumberSchema().isPositive(false).execute(0)).rejects.toThrow();
    expect(() => new NumberSchema().isPositive(true).execute(-10)).rejects.toThrow();
  });

  test(".isNegative works", async () => {
    expect(await new NumberSchema().isNegative(false).execute(-15)).toBe(-15);
    expect(await new NumberSchema().isNegative(true).execute(0)).toBe(0);
    expect(() => new NumberSchema().isNegative(false).execute(0)).rejects.toThrow();
    expect(() => new NumberSchema().isNegative(true).execute(10)).rejects.toThrow();
  });
});
