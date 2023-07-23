import { ArraySchema } from "../ArraySchema";
import { NumberSchema } from "../NumberSchema";

describe("ArraySchema", () => {
  it("returns same value with blank validation queue", async () => {
    expect(await new ArraySchema().execute([])).toEqual([]);
  });

  it(".min works!", async () => {
    expect(await new ArraySchema().min(3).execute([1, 2, 3])).toEqual([1, 2, 3]);
    expect(() => new ArraySchema().min(5).execute([])).rejects.toThrow();
  });

  it(".max works!", async () => {
    expect(await new ArraySchema().max(3).execute([1, 2, 3])).toEqual([1, 2, 3]);
    expect(() => new ArraySchema().max(3).execute([1, 2, 3, 4])).rejects.toThrow();
  });

  it(".of works!", async () => {
    const numSchema1 = new NumberSchema().min(20).max(30);
    const numSchema2 = new NumberSchema().min(20).max(30);
    const numSchema3 = new NumberSchema().min(20).max(30);
    expect(await new ArraySchema().of(numSchema1).execute([25, 23])).toEqual([25, 23]);
    expect(() => new ArraySchema().of(numSchema2).execute(["a", "b"])).rejects.toThrow();
    expect(() => new ArraySchema().of(numSchema3).execute(["10", "20"])).rejects.toThrow();
  });
});
