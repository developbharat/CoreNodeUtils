type IValidationOperationFunc<T> = (value: T) => T | void;

export class Schema<T> {
  private operationsQueue: IValidationOperationFunc<T>[] = [];

  constructor() {
    this.operationsQueue = [];
  }

  validate(value: T): T {
    let processedValue = value;
    for (const operation of this.operationsQueue) {
      const result = operation(processedValue);
      if (typeof result !== "undefined") processedValue = result;
    }
    return processedValue;
  }

  protected addToQueue(operation: IValidationOperationFunc<T>): this {
    this.operationsQueue.push(operation);
    return this;
  }
}
