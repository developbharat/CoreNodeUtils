import { SchemaException } from "../errors/SchemaException";

export type ISchemaRule<T> = (value: T) => Promise<T | void> | (T | void);

export abstract class Schema<T = any> {
  private validations: ISchemaRule<T>[] = [];

  constructor() {
    this.validations = [];
  }

  /**
   * Function executed before validations
   * @throws {SchemaException} SchemaException must be thrown from this function.
   *
   * Example Usage:
   *
   * class EmailSchema extends Schema<string>{
   *  private apiClient: ApiClient;
   *  constructor() { ... }
   *
   *  protected override async preexecute(): Promise<void>{
   *    const client = new EmailServiceClient();
   *    this.apiClient = await client.connect();
   *  }
   *
   * }
   */
  protected preexecute(): void | Promise<void> {}

  /**
   * Function executed after validations
   * @throws {SchemaException} SchemaException must be thrown from this function.
   *
   * Example Usage:
   *
   * class EmailSchema extends Schema<string>{
   *  private apiClient: ApiClient;
   *  constructor() { ... }
   *
   *  protected override async postexecute(): Promise<void>{
   *    this.apiClient.disconnect();
   *  }
   *
   * }
   */
  protected postexecute(): void | Promise<void> {}

  /**
   * Function used to validate if the provided value is supported by validator.
   * @throws {SchemaException} SchemaException must be thrown from this function.
   *
   * Example Usage:
   *
   * class CharactersSchema extends Schema<string[]>{
   *
   *  constructor(){ ... }
   *
   *  protected override supports(value){
   *    // Example 1:
   *    if(!Array.isArray(value)) throw new SchemaException(`${value} must be an array.`)
   *
   *    // Example 2:
   *    if(typeof value !== "string") throw new SchemaException(`${value} must be a valid string.`)
   *  }
   * }
   */
  protected abstract supports(_value: T): void | Promise<void>;

  /**
   * This function must be executed after you declare all validation rules.
   *
   * Example Usage:
   * new Schema().trim().min(20).max(200).prepare("1000");
   *
   *
   * @param value {T} Value that needs to validated by validator.
   * @returns value {T} Final value after transformation
   */
  async execute(value: T): Promise<T> {
    /**
     * We ensure all prevalidation functions always throws SchemaException
     */
    try {
      /**
       * Checks if value is supported by validator
       */
      await this.supports(value);

      /**
       * We allow child class to make all necessary preperations before execution.
       */
      await this.preexecute();

      /**
       * Let's execute the validator
       */
      let processedValue = value;
      for (const operation of this.validations) {
        const result = await operation(processedValue);
        /**
         * Ignore value if validator functions returns void,
         * It's ok because:
         * ValidatorFn only return value when it needs to update some value such as .trim(), .replace() etc.
         * ValidatorFn returns void for valid values that need not be changed.
         * ValidatorFn throws SchemaException for invalid value
         */
        if (typeof result !== "undefined") processedValue = result;
      }

      /**
       * We allow child class to gracefully exit after validation.
       */
      await this.postexecute();

      /**
       * Reset all the validation functions and return processed value.
       */
      this.validations = [];
      return processedValue;
    } catch (ex) {
      throw ex instanceof SchemaException ? ex : new SchemaException(ex);
    }
  }

  /**
   * This function should be used to add 1 or more validation rules to schema.
   * @param operation {ISchemaRule} Function that needs to be executed for validation.
   * @returns {Schema} returns this;
   */
  protected addRule(operation: ISchemaRule<T> | ISchemaRule<T>[]): this {
    if (!Array.isArray(operation)) {
      /**
       * Add 1 rule if operation is not ISchemaRule[]
       */
      this.validations.push(operation);
    } else {
      /**
       * Add multiple rules if operation is ISchemaRule[]
       */
      (operation as ISchemaRule<T>[]).forEach((op) => this.validations.push(op));
    }

    return this;
  }
}
