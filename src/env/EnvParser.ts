import { EnvironmentException } from "../errors/EnvironmentException.js";
import { Env, IEnvMap, IEnvValue } from "./Env.js";
import dotenv from "dotenv";
import fs from "fs";
import { join, isAbsolute } from "path";
import { ExceptionName } from "../errors/ExceptionName.js";

export type IValidatorFn<T = any> = (value: T) => T;
export type IRulesMap<T> = Map<string, IValidatorFn<T>>;

export interface IEnvParserOptions {
  appRoot: string;
  envFilename?: string;
  isEnvFileOptional?: boolean;
}

export class EnvParser {
  private loadEnvFile(
    appRoot: string,
    envFilename: string = ".env",
    optional: boolean = false
  ): { [key: string]: IEnvValue } {
    try {
      const absPath = isAbsolute(envFilename)
        ? envFilename
        : join(appRoot, envFilename);

      const contents = fs.readFileSync(absPath, "utf-8");
      return dotenv.parse(contents);
    } catch (error) {
      if (optional) return {};

      if (error.code === "ENOENT") {
        throw new EnvironmentException(
          `The "${envFilename}" file is missing`,
          ExceptionName.E_MISSING_ENV_FILE
        );
      } else {
        throw new EnvironmentException(
          (error as Error).message,
          ExceptionName.E_INVALID_ENV_CONTENTS
        );
      }
    }
  }

  private validateRules<T extends { [key: string]: IValidatorFn }>(
    rules: T,
    env: { [key: string]: IEnvValue }
  ): IEnvMap {
    const envData: IEnvMap = new Map();

    Object.keys(rules).forEach((rulename) => {
      const envValue = rules[rulename]!(env[rulename]); // Execute validator function to validate value and normalize value.

      envData.set(rulename, envValue); // Set envData
    });

    return envData;
  }

  public static rules<T extends { [key: string]: IValidatorFn }>(
    rules: T,
    options: IEnvParserOptions
  ): Env<T> {
    // Load Environment variables from .env file
    const parser = new EnvParser();
    const parsedEnv = parser.loadEnvFile(
      options.appRoot,
      options.envFilename,
      options.isEnvFileOptional
    );

    // Validate all environment variables
    const envData = parser.validateRules(rules, parsedEnv);

    // Return new Environment
    const env = new Env<T>(envData);
    return env;
  }
}
