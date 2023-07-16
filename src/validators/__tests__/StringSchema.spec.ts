import { StringSchema } from "../StringSchema";

describe("StringSchema", () => {
  test("order of validations works", () => {
    expect(() => new StringSchema().max(4).trim().validate("  ABC  ")).toThrow();
    expect(new StringSchema().trim().max(4).validate("  BCD    ")).toBe("BCD");
  });

  test(".trim works", () => {
    expect(new StringSchema().trim().validate("  12  ")).toBe("12");
    expect(new StringSchema().trim().validate("    ")).toBe("");
  });

  test(".min works", () => {
    expect(() => new StringSchema().min(2).validate("A")).toThrow();
    expect(new StringSchema().min(2).validate("AB")).toBe("AB");
  });

  test(".max works", () => {
    expect(() => new StringSchema().max(5).validate("123456")).toThrow();
    expect(new StringSchema().max(6).validate("123456")).toBe("123456");
  });

  test(".matches works", () => {
    expect(new StringSchema().matches(/^\d+$/).validate("20")).toBe("20");
    expect(() => new StringSchema().matches(/^\d+$/).validate("AB")).toThrow();
    expect(() => new StringSchema().matches(/^\d+$/).validate("20AB")).toThrow();
  });
});
