import { ExceptionCode } from "./ExceptionCode.js";
import { ExceptionName } from "./ExceptionName.js";

export class SchemaException extends Error {
  public override name = ExceptionName.E_INVALID_SCHEMA_VALUE;
  public code = ExceptionCode.E_INVALID_SCHEMA_VALUE;

  constructor(message: string) {
    super(message);
  }
}
