import { Schema } from "./Schema.js";
import { SchemaException } from "../errors/SchemaException.js";

export class ArraySchema<T> extends Schema<T[]> {
  constructor() {
    super();
    this.addToQueue((value: T[]) => {
      if (!Array.isArray(value)) throw new SchemaException(`${value} must be an array.`);
    });
  }

  min(length: number): this {
    this.addToQueue((value: T[]) => {
      if (value.length < length) throw new SchemaException(`${value} must contain atleast ${length} elements`);
    });

    return this;
  }

  max(length: number): this {
    this.addToQueue((value: T[]) => {
      if (value.length > length) throw new SchemaException(`${value} must contain maximum ${length} elements.`);
    });

    return this;
  }

  of(schema: Schema<T>): this {
    this.addToQueue((value: T[]) => {
      const result: T[] = [];
      for (const element of value) {
        result.push(schema.validate(element));
      }

      return result;
    });
    return this;
  }
}
