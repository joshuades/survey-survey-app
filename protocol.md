## Protocol

DID: 
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
    - Important: in .env for each hash exchange all `$` with `\$`
- put those hashes into the env. variable `HASHED_PASSWORDS`