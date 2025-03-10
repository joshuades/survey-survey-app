## Protocol

**DID:**

- `npx create-next-app@latest`
  - Next.js 14.2.15
  - answers all 'yes'
- follow v0: "how can i implement a Survey Builder with AI using next js?"
- `npm i lucide-react`
- `npx shadcn@latest init`
  - 'default' style, 'zinc' and yes for the css variables
- `npx shadcn@latest add textarea` (etc.)
- generate & copy api key from https://platform.openai.com/api-keys into .env.local & into vercel settings
- as env. variable add `NEXT_PUBLIC_ENABLE_AUTH="true"` to enable/disable auth
- use the script `node src/scripts/hashPassword.mjs password1 password2 password3` to generate password hashes
  - Important: in .env.local for each hash: exchange all `$` with `\$`. But: in vercel leave `$` as they are
- put those hashes into the env. variable `HASHED_PASSWORDS`
- add database
  - follow v0: "I have a next js 14.2.15 app on vercel and i want to setup a postgres database with the drizzle orm. how do i set this up?"
  - follow docs
    - [drizzle "postgresql-new"](https://orm.drizzle.team/docs/get-started/postgresql-new)
    - [drizzle "drizzle-with-vercel-edge-functions"](https://orm.drizzle.team/docs/tutorials/drizzle-with-vercel-edge-functions#vercel-postgres)
  - `npm install drizzle-orm pg @vercel/postgres`
  - `npm install -D drizzle-kit @types/pg`
  - **IMPORTANT**: to use env variables in `drizzle.config.ts` you need to create and the following code:
    ```ts
    import { loadEnvConfig } from "@next/env";
    const projectDir = process.cwd();
    loadEnvConfig(projectDir);
    ```
- setup prettier to format on save and add script "npm run format"
  - npm install --save-dev eslint-config-prettier
  - npm install -D prettier prettier-plugin-tailwindcss
- setup new authentication

  - npm install next-auth@beta
    - check [introduction by leerob](https://www.youtube.com/watch?v=DJvM2lSPn6w&list=LL&index=5&t=601s)
    - setup with code from [next-auth-example](https://github.com/nextauthjs/next-auth-example/)
    - setup [Google Authentication](https://www.telerik.com/blogs/how-to-implement-google-authentication-nextjs-app-using-nextauth)
  - use [drizzle adapter](https://authjs.dev/getting-started/adapters/drizzle) as database for authjs

- [vercel: testing with jest](https://nextjs.org/docs/14/app/building-your-application/testing/jest)
  - `npm install -D jest jest-environment-jsdom @testing-library/react @testing-library/jest-dom`
  - follow [jest with typescript](https://jestjs.io/docs/getting-started#using-typescript)
    - `npm install --save-dev babel-jest @babel/core @babel/preset-env`
    - `npm install --save-dev @babel/preset-typescript`
    - `npm install --save-dev ts-jest`
    - `npx ts-jest config:init`
    - `npx jest --init`
    - **but** not working with _next-auth_
