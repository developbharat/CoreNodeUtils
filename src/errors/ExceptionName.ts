export enum ExceptionName {
  E_MISSING_ENV_FILE = "E_MISSING_ENV_FILE",
  E_INVALID_ENV_CONTENTS = "E_INVALID_ENV_CONTENTS"
}

export type IExceptionName = keyof typeof ExceptionName;
