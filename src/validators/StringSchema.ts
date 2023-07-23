import { SchemaException } from "../errors/SchemaException";
import { Schema } from "./Schema";

export class StringSchema extends Schema<string> {
  protected override supports(value: string): void {
    if (typeof value !== "string") throw new SchemaException(`Provided value ${value} is not supported.`);
  }

  min(count: number): this {
    this.addRule((value) => {
      if (value.length < count) throw new SchemaException(`${value} must contain atleast ${count} characters.`);
    });

    return this;
  }

  max(count: number): this {
    this.addRule((value) => {
      if (value.length > count) throw new SchemaException(`${value} must contain maximum ${count} characters.`);
    });

    return this;
  }

  matches(pattern: RegExp | string, label: string | null = null): this {
    this.addRule((value) => {
      if (!RegExp(pattern).test(value))
        throw new SchemaException(`${value} must match ${label ?? String(pattern)} pattern.`);
    });

    return this;
  }

  trim(): this {
    this.addRule((value) => value.trim());

    return this;
  }
}
