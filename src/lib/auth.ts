import NextAuth from "next-auth";
import "next-auth/jwt";

// import { db } from "@/db";
import { DrizzleAdapter } from "@auth/drizzle-adapter";
import Google from "next-auth/providers/google";

import { sql } from "@vercel/postgres";
import { drizzle } from "drizzle-orm/vercel-postgres";
const db = drizzle({ client: sql, casing: "snake_case" });

export const { handlers, auth, signIn, signOut } = NextAuth({
  debug: !!process.env.AUTH_DEBUG,
  theme: { logo: "https://authjs.dev/img/logo-sm.png" },
  adapter: DrizzleAdapter(db),
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  ],
  basePath: "/auth",
  session: { strategy: "jwt" },
  callbacks: {
    // authorized({ request, auth }) {
    //   const { pathname } = request.nextUrl;
    //   if (pathname === "/middleware-example") return !!auth;
    //   return true;
    // },
    session: async ({ session, token }) => {
      if (session?.user) {
        if (token.sub) {
          session.user.id = token.sub;
        }
      }
      if (token?.accessToken) session.accessToken = token.accessToken;

      return session;
    },
    jwt: async ({ user, token, trigger, session }) => {
      if (user) {
        token.uid = user.id;
      }
      if (trigger === "update") token.name = session.user.name;
      return token;
    },
  },
  experimental: { enableWebAuthn: true },
});

declare module "next-auth" {
  interface Session {
    accessToken?: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    accessToken?: string;
  }
}
