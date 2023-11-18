import Auth0Provider from "next-auth/providers/auth0";
import type { NextAuthConfig, Session, User } from "next-auth";
import NextAuth from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { D1Adapter } from "@auth/d1-adapter";

const authOptions: NextAuthConfig = {
  secret: process.env.AUTH_SECRET,
  // Configure one or more authentication providers
  providers: [
    Auth0Provider({
      clientId: process.env.AUTH0_CLIENT_ID,
      clientSecret: process.env.AUTH0_CLIENT_SECRET,
      issuer: process.env.AUTH0_DOMAIN,
    }),
  ],
  adapter: D1Adapter(process.env.ADMIN_DB),
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
