import { SchemaException } from "../../errors/SchemaException";

export class EnvStringSchema {
  private _value: string = "";

  constructor(value: string) {
    this._value = value;
  }

  public static createSchema(value: string) {
    return new EnvStringSchema(value);
  }

  /**
   * Trims whitespaces from start and end of string
   * @returns {EnvStringSchema} Instance of EnvStringSchema to chain other operations.
   */
  public trim(): EnvStringSchema {
    this._value = this._value.trim();
    return this;
  }

  /**
   * Converts value to lowercase
   * @returns {EnvStringSchema} Instance of EnvStringSchema to chain other operations.
   */
  public toLowerCase(): EnvStringSchema {
    this._value = this._value.toLowerCase();
    return this;
  }

  /**
   * Converts value to uppercase
   * @returns {EnvStringSchema} Instance of EnvStringSchema to chain other operations.
   */
  public toUpperCase(): EnvStringSchema {
    this._value = this._value.toUpperCase();
    return this;
  }

  /**
   * Matches a value against provided regex.
   * @throws {SchemaException} Throws error incase value does not match.
   * @returns {EnvStringSchema} Instance of EnvStringSchema to chain other operations.
   */
  public matches(regex: RegExp | string, label?: string): EnvStringSchema {
    if (!this._value.match(regex)) {
      const status = `The value ${this._value} doesn't match ${label || regex.toString()} rule`;
      throw new SchemaException(status);
    }
    return this;
  }

  /**
   * Checks if a value contains lowercase and uppercase alphabets only.
   * @throws {SchemaException} Throws error incase of check failure.
   * @returns {EnvStringSchema} Instance of EnvStringSchema to chain other operations.
   */
  public isAlpha(): EnvStringSchema {
    if (!this._value.match("^[A-Za-z]+$")) {
      throw new SchemaException(`The value ${this._value} must contain only alphabets.`);
    }
    return this;
  }

  /**
   * Checks if a value contains lowercase, uppercase alphabets and numbers only.
   * @throws {SchemaException} Throws error incase of check failure.
   * @returns {EnvStringSchema} Instance of EnvStringSchema to chain other operations.
   */
  public isAlphaNum(): EnvStringSchema {
    if (!this._value.match("^[0-9A-Za-z]+$")) {
      throw new SchemaException(`The value ${this._value} must contain only alphabets and numbers.`);
    }
    return this;
  }

  public toString(): string {
    return this._value;
  }
}
