"use client";

import React from "react";
import dynamic from "next/dynamic";

const NgWords = dynamic(() => import("./NgWords"), { ssr: false });

const Page = () => {
  return (
    <div>
      <NgWords />
    </div>
  );
};

export default Page;
