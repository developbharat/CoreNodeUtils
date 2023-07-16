import { SchemaException } from "../errors/SchemaException";
import { Schema } from "./Schema";

export class StringSchema extends Schema<string> {
  constructor() {
    super();

    this.addToQueue((value: string) => {
      if (typeof value !== "string") throw new SchemaException(`${value} must be a string.`);
    });
  }

  min(count: number): this {
    this.addToQueue((value: string) => {
      if (value.length < count) throw new SchemaException(`${value} must contain atleast ${count} characters.`);
    });

    return this;
  }

  max(count: number): this {
    this.addToQueue((value: string) => {
      if (value.length > count) throw new SchemaException(`${value} must contain maximum ${count} characters.`);
    });

    return this;
  }

  matches(pattern: RegExp | string, label: string | null = null): this {
    this.addToQueue((value: string) => {
      if (!RegExp(pattern).test(value))
        throw new SchemaException(`${value} must match ${label ?? String(pattern)} pattern.`);
    });

    return this;
  }

  trim(): this {
    this.addToQueue((value: string) => value.trim());

    return this;
  }
}
