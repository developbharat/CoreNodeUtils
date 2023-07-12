import { IExceptionName } from "./ExceptionName.js";

export interface IExceptionCode extends Record<IExceptionName, number> {}

export const ExceptionCode: IExceptionCode = {
  E_MISSING_ENV_FILE: 500,
  E_INVALID_ENV_CONTENTS: 500,
  E_INVALID_SCHEMA_VALUE: 500,
};
