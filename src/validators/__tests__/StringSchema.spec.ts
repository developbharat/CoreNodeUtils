import { StringSchema } from "../StringSchema";

describe("StringSchema", () => {
  test("order of validations works", async () => {
    expect(() => new StringSchema().max(4).trim().execute("  ABC  ")).rejects.toThrow();
    expect(await new StringSchema().trim().max(4).execute("  BCD    ")).toBe("BCD");
  });

  test(".trim works", async () => {
    expect(await new StringSchema().trim().execute("  12  ")).toBe("12");
    expect(await new StringSchema().trim().execute("    ")).toBe("");
  });

  test(".min works", async () => {
    expect(() => new StringSchema().min(2).execute("A")).rejects.toThrow();
    expect(await new StringSchema().min(2).execute("AB")).toBe("AB");
  });

  test(".max works", async () => {
    expect(() => new StringSchema().max(5).execute("123456")).rejects.toThrow();
    expect(await new StringSchema().max(6).execute("123456")).toBe("123456");
  });

  test(".matches works", async () => {
    expect(await new StringSchema().matches(/^\d+$/).execute("20")).toBe("20");
    expect(() => new StringSchema().matches(/^\d+$/).execute("AB")).rejects.toThrow();
    expect(() => new StringSchema().matches(/^\d+$/).execute("20AB")).rejects.toThrow();
  });
});
