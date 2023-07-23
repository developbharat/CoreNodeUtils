import { Schema } from "../Schema";

class CustomSchema extends Schema<string> {
  protected supports(_value: string): void {}

  trim(): this {
    this.addRule((value) => value.trim());
    return this;
  }

  isNumeric(): this {
    this.addRule((value) => {
      if (Number.isNaN(Number(value))) throw new Error("Number is not numeric.");
    });

    return this;
  }
}

describe("Schema", () => {
  it("returns same value with blank validation queue", async () => {
    class Test extends Schema<any> {
      protected supports(_value: any): void | Promise<void> {}
    }

    expect(await new Test().execute({})).toEqual({});
    expect(await new Test().execute(0)).toBe(0);
    expect(await new Test().execute("")).toBe("");
    expect(await new Test().execute([])).toEqual([]);
  });

  it("returns processed value after validate.", async () => {
    expect(await new CustomSchema().trim().execute("  100  ")).toBe("100");
    expect(await new CustomSchema().trim().isNumeric().execute(" 100 ")).toBe("100");
  });

  it("throws error for invalid value", async () => {
    expect(() => new CustomSchema().trim().isNumeric().execute(" AVC ")).rejects.toThrow();
    expect(await new CustomSchema().trim().isNumeric().execute("100")).toBe("100");
  });
});
