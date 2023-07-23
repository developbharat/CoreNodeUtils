import { Schema } from "./Schema.js";
import { SchemaException } from "../errors/SchemaException.js";

export class ArraySchema<T> extends Schema<T[]> {
  protected override supports(value: T[]): void | Promise<void> {
    if (!Array.isArray(value)) throw new SchemaException(`Provided value ${value} is not supported.`);
  }

  min(length: number): this {
    this.addRule((value: T[]) => {
      if (value.length < length) throw new SchemaException(`${value} must contain atleast ${length} elements`);
    });

    return this;
  }

  max(length: number): this {
    this.addRule((value: T[]) => {
      if (value.length > length) throw new SchemaException(`${value} must contain maximum ${length} elements.`);
    });

    return this;
  }

  of(schema: Schema): this {
    this.addRule(async (values) => {
      const result: T[] = [];
      for (let value of values) {
        result.push(await schema.execute(value));
      }
      return result;
    });

    return this;
  }
}
