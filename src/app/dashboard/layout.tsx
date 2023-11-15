"use client";

import React from "react";
import Link from "next/link";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<DashboardLayoutProps> = ({ children }) => {
  return (
    <div className="flex h-screen">
      <div className="bg-gray-800 w-64">
        <div className="flex items-center justify-center mt-10">
          <Link
            href="/dashboard"
            className="text-white text-2xl mx-2 font-semibold"
          >
            Dashboard
          </Link>
        </div>
        <nav className="mt-10">
          <Link
            href="/dashboard/boards"
            className="flex items-center py-2 px-8 bg-gray-900 text-gray-400 hover:bg-gray-700"
          >
            <svg
              className="h-6 w-6 text-gray-300"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
            <span className="mx-4 font-medium">Boards</span>
          </Link>
          <Link
            href="/dashboard/caps"
            className="flex items-center py-2 px-8 text-gray-400 hover:bg-gray-700"
          >
            <svg
              className="h-6 w-6 text-gray-300"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
            <span className="mx-4 font-medium">Caps</span>
          </Link>
          <Link
            href="/dashboard/global"
            className="flex items-center py-2 px-8 text-gray-400 hover:bg-gray-700"
          >
            <svg
              className="h-6 w-6 text-gray-300"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
            <span className="mx-4 font-medium">Global</span>
          </Link>
        </nav>
      </div>
      <div className="flex-1 overflow-scroll overflow-x-hidden">{children}</div>
    </div>
  );
};

export default Layout;
