import { EnvironmentException } from "../errors/EnvironmentException.js";
import { ExceptionName } from "../errors/ExceptionName.js";

export type IEnvValue = string | number | boolean | string[] | number[];
export type IEnvMap = Map<string, IEnvValue>;

export class Env<T> {
  private envData: IEnvMap = new Map(); // Data from .env file

  constructor(envData: IEnvMap) {
    this.envData = envData;
  }

  public get<
    K extends keyof T,
    D = T[K] extends (...args: any) => any ? ReturnType<T[K]> : never,
    R = D extends never ? never : D
  >(key: K, defaultValue?: D): R {
    const envValue = this.envData.get(key as string);

    // Return environment variable value if found.
    if (!!envValue) return envValue as R;

    // Return default value incase it is defined.
    if (defaultValue) return defaultValue as R;

    // Throw Exception for key not found in .env file
    throw new EnvironmentException(
      `Environment variable ${key.toString()} doesn't exist in .env file.`,
      ExceptionName.E_INVALID_ENV_CONTENTS
    );
  }
}
