# Quickstart

## Install via npm

```bash
npm install @developbharat/corenodeutils
```

And You are done. Now import various features and use them.

## Features

### Environment Validator

Our Environment Validator works as follows:

- Read .env file
- Validates .env file
- You use the validated data.

<!-- tabs:start -->

##### **env.ts**

```ts
import { EnvParser, StringValidator, NumberValidator } from "@developbharat/corenodeutils";

// Declare your own .env file
export const Env = EnvParser.rules({
  HOST: new StringValidator().trim().min(10).max(30),
  PORT: new NumberValidator().min(100).max(5000),
  DOMAIN: new StringValidator().trim().min(10).max(30),
});
```

##### **index.ts**

```ts
import { Env } from "./env.js";

// This is how you get host.
const host = Env.get("HOST", "0.0.0.0");
```

<!-- tabs:end -->
