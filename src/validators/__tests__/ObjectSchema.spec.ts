import { ObjectSchema } from "../ObjectSchema";
import { StringSchema } from "../StringSchema";
import { NumberSchema } from "../NumberSchema";

describe("ObjectSchema", () => {
  const ip = " 192.168.451.581 ";

  it("returns same value with blank validation queue", async () => {
    expect(await new ObjectSchema().execute({})).toEqual({});
  });

  it(".oneOf works with required!", async () => {
    const hostSchema1 = new StringSchema().trim().min(5).max(15);
    const hostSchema2 = new StringSchema().trim().min(5).max(15);
    expect(await new ObjectSchema().oneOf("HOST", hostSchema1).execute({ HOST: ip })).toEqual({ HOST: ip.trim() });
    expect(await new ObjectSchema().oneOf("HOST", hostSchema2).execute({ HOST: ip })).toEqual({ HOST: ip.trim() });
  });

  it(".oneOf fails with required!", async () => {
    const hostSchema1 = new StringSchema().trim().min(5).max(15);
    const hostSchema2 = new StringSchema().trim().min(5).max(15);
    expect(() => new ObjectSchema().oneOf("HOST", hostSchema1).execute({})).rejects.toThrow();
    expect(() => new ObjectSchema().oneOf("HOST", hostSchema2).execute({})).rejects.toThrow();
  });

  it(".must works", async () => {
    expect(
      await new ObjectSchema()
        .must({
          HOST: new StringSchema().trim().min(5).max(15),
          PORT: new NumberSchema().isPositive(),
        })
        .execute({ HOST: ip, PORT: 30 }),
    ).toEqual({ HOST: ip.trim(), PORT: 30 });
  });

  it(".must fails", async () => {
    expect(() =>
      new ObjectSchema()
        .must({
          HOST: new StringSchema().trim().min(5).max(15),
          PORT: new NumberSchema().isPositive(),
        })
        .execute({}),
    ).rejects.toThrow();
  });

  it(".optional works with missing values.", async () => {
    expect(
      await new ObjectSchema()
        .optional({
          HOST: new StringSchema().trim().min(5).max(15),
          PORT: new NumberSchema().isPositive(),
        })
        .execute({}),
    ).toEqual({});
  });

  it(".optional works with found values.", async () => {
    expect(
      await new ObjectSchema()
        .optional({
          HOST: new StringSchema().trim().min(5).max(15),
          PORT: new NumberSchema().isPositive(),
        })
        .execute({ HOST: ip.trim(), PORT: 30 }),
    ).toEqual({ HOST: ip.trim(), PORT: 30 });
  });

  it(".optional fails with invalid value", async () => {
    expect(() =>
      new ObjectSchema()
        .optional({
          HOST: new StringSchema().trim().min(5).max(15),
          PORT: new NumberSchema().isPositive(),
        })
        .execute({ PORT: -100 }),
    ).rejects.toThrow();
  });

  it("combined .must and .optional works", async () => {
    expect(
      await new ObjectSchema()
        .must({
          HOST: new StringSchema().trim().min(5).max(15),
        })
        .optional({
          PORT: new NumberSchema().isPositive(),
        })
        .execute({ HOST: ip.trim() }),
    ).toEqual({ HOST: ip.trim() });
  });
});
