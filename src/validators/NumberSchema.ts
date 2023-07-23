import { SchemaException } from "../errors/SchemaException";
import { Schema } from "./Schema";

export class NumberSchema extends Schema<number> {
  protected override supports(value: number): void {
    if (typeof value !== "number") throw new SchemaException(`Provided value ${value} is not supported.`);
  }

  min(minimum: number): this {
    this.addRule((value) => {
      if (value < minimum) throw new SchemaException(`${value} must be more than ${minimum}.`);
    });

    return this;
  }

  max(maximum: number): this {
    this.addRule((value) => {
      if (value > maximum) throw new SchemaException(`${value} must be less than ${maximum}.`);
    });

    return this;
  }

  isZero(): this {
    this.addRule((value) => {
      if (value !== 0) throw new SchemaException(`${value} must be zero.`);
    });

    return this;
  }

  isPositive(isZeroAllowed: boolean = false): this {
    this.addRule((value) => {
      const isInvalid = isZeroAllowed ? value < 0 : value <= 0;
      const error = `${value} must be postive ${isZeroAllowed ? "or zero" : ""}`.trimEnd();
      if (isInvalid) throw new SchemaException(error);
    });

    return this;
  }

  isNegative(isZeroAllowed: boolean = false): this {
    this.addRule((value) => {
      const isInvalid = isZeroAllowed ? value > 0 : value >= 0;
      const error = `${value} must be negative ${isZeroAllowed ? "or zero" : ""}`.trimEnd();
      if (isInvalid) throw new SchemaException(error);
    });

    return this;
  }
}
