"use client";

import Tab from "@/components/Tab";
import React from "react";

const Page = () => {
  return (
    <div>
      <Tab
        tabItems={[
          {
            tabKey: "manage-admin-users",
            tabLabel: "Manage Admins Users",
            children: <div>manage admin users</div>, // TODO: show, add, edit and delete admin users
          },
          {
            tabKey: "audit-log",
            tabLabel: "Audit Log",
            children: <div>audit log</div>, // TODO: show audit log
          },
        ]}
      />
    </div>
  );
};

export default Page;
