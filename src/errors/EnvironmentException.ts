import { ExceptionCode } from "./ExceptionCode.js";
import { IExceptionName } from "./ExceptionName.js";

export class EnvironmentException extends Error {
  public override name: IExceptionName;
  public code: number;

  constructor(message: string, name: IExceptionName) {
    super(message);
    this.name = name;
    this.code = ExceptionCode[name]!;
  }
}
