import { Schema } from "../Schema";

class CustomSchema extends Schema<string> {
  constructor() {
    super();
  }

  trim(): this {
    this.addToQueue((value) => value.trim());
    return this;
  }

  isNumeric(): this {
    this.addToQueue((value) => {
      if (Number.isNaN(Number(value))) throw new Error("Number is not numeric.");
    });

    return this;
  }
}

describe("Schema", () => {
  it("returns same value with blank validation queue", () => {
    expect(new Schema().validate({})).toEqual({});
    expect(new Schema().validate(0)).toBe(0);
    expect(new Schema().validate("")).toBe("");
    expect(new Schema().validate([])).toEqual([]);
  });

  it("returns processed value after validate.", () => {
    expect(new CustomSchema().trim().validate("  100  ")).toBe("100");
    expect(() => new CustomSchema().trim().isNumeric().validate(" 100 ")).not.toThrow();
    expect(new CustomSchema().trim().isNumeric().validate(" 100 ")).toBe("100");
  });

  it("throws error for invalid value", () => {
    expect(() => new CustomSchema().trim().isNumeric().validate(" AVC ")).toThrow();
    expect(new CustomSchema().trim().isNumeric().validate("100")).toBe("100");
  });
});
