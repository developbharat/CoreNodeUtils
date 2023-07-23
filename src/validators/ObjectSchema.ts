import { SchemaException } from "../errors/SchemaException.js";
import { Schema } from "./Schema.js";

type IKey = string | number | symbol;
export class ObjectSchema extends Schema<{ [key: IKey]: any }> {
  protected override supports(value: object): void {
    if (typeof value !== "object") throw new SchemaException(`Provided value ${value} is not supported.`);
  }

  must(objSchema: { [key: IKey]: Schema }): this {
    Object.entries(objSchema).forEach(([key, schema]) => {
      this.oneOf(key, schema, true);
    });

    return this;
  }

  optional(objSchema: { [key: IKey]: Schema }): this {
    Object.entries(objSchema).forEach(([key, schema]) => {
      this.oneOf(key, schema, false);
    });

    return this;
  }

  oneOf<K = IKey>(key: IKey, schema: Schema<K>, required: boolean = true): this {
    this.addRule(async (value) => {
      /**
       * Return if value is not required and value is missing.
       */
      if (!required && !value[key]) return;

      /**
       * Throw error if key is not found.
       */

      if (required && !value[key]) throw new SchemaException(`${key.toString()} is required, but found missing.`);

      /**
       * Validate value.
       */
      const result = await schema.execute(value[key]);
      return { ...value, [key]: result };
    });

    return this;
  }
}
