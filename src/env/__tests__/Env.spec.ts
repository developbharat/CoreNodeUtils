import { EnvironmentException } from "../../errors/EnvironmentException.js";
import { Env } from "../Env.js";

describe("Env.get", () => {
  let env = new Env<{ HOST: () => string }>(new Map());
  beforeAll(() => {
    const map = new Map();
    map.set("HOST", "127.0.0.1");
    env = new Env(map);
  });

  it("returns valid value for existing key", () => {
    expect(env.get("HOST")).toBe("127.0.0.1");
  });

  it("returns default value for unknown key", () => {
    expect((env as any).get("DOMAIN", "0.0.0.0")).toBe("0.0.0.0");
  });

  it("throws error for unknown key without defaultValue", () => {
    expect(() => (env as any).get("DOMAIN")).toThrowError(EnvironmentException);
  });
});
