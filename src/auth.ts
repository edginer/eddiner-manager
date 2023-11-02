import type { NextAuthConfig, Session, User } from "next-auth";
import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { NextRequest, NextResponse } from "next/server";

const authOptions: NextAuthConfig = {
  secret: process.env.AUTH_SECRET,
  // Configure one or more authentication providers
  providers: [
    Credentials({
      name: "DefaultCredentials",
      credentials: {
        username: { label: "Username", type: "text", placeholder: "jsmith" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials, req) {
        if (
          credentials?.username == process.env.ADMIN_NAME &&
          credentials?.password == process.env.ADMIN_PASSWORD
        ) {
          const user: User = { id: "1", name: "J Smith" };
          return user;
        }

        return null;
      },
    }),
  ],
  callbacks: {
    async authorized(params: { request: NextRequest; auth: Session | null }) {
      if (params.auth) {
        return true;
      }
      const pathName = params.request.nextUrl.pathname;
      params.request.nextUrl.pathname = "/api/auth/signin";
      params.request.nextUrl.searchParams.set("callback", pathName);
      return NextResponse.redirect(params.request.nextUrl);
    },
  },
};

export const { handlers, auth, signIn, signOut } = NextAuth(authOptions);
