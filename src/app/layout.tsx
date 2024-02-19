"use client";

import "react-toastify/dist/ReactToastify.css";
import "./globals.css";
import React from "react";
import { SessionProvider } from "next-auth/react";
import { Inter } from "next/font/google";
import { Suspense } from "react";
import { RecoilRoot } from "recoil";
import { Spinner } from "flowbite-react";
import { ErrorBoundary } from "react-error-boundary";
import { SWRConfig } from "swr";
import { ToastContainer } from "react-toastify";
import { ApolloProvider, ApolloClient, InMemoryCache } from "@apollo/client";

const apollotClient = new ApolloClient({
  uri: "/api/graphql",
  cache: new InMemoryCache(),
});

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const fetcher = (url: string) => fetch(url).then((r) => r.json());

  return (
    <html lang="en">
      <body className={inter.className}>
        <RecoilRoot>
          <SWRConfig
            value={{
              fetcher,
              suspense: true,
            }}
          >
            <ApolloProvider client={apollotClient}>
              <SessionProvider>
                <ErrorBoundary
                  fallbackRender={(props) => <div>Error: {props.error}</div>}
                >
                  <Suspense
                    fallback={
                      <Spinner size="xl" className="fixed inset-0 m-auto" />
                    }
                  >
                    {children}
                  </Suspense>
                </ErrorBoundary>
              </SessionProvider>
            </ApolloProvider>
            <ToastContainer theme="colored" />
          </SWRConfig>
        </RecoilRoot>
      </body>
    </html>
  );
}
