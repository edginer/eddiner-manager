"use client";

import "./globals.css";
import { SessionProvider } from "next-auth/react";
import { Inter } from "next/font/google";
import { Suspense } from "react";
import { RecoilRoot } from "recoil";
import { Spinner } from "flowbite-react";
import { ErrorBoundary } from "react-error-boundary";
import { SWRConfig } from "swr";

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
          </SWRConfig>
        </RecoilRoot>
      </body>
    </html>
  );
}
