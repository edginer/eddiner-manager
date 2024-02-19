"use client";

import Tab from "@/components/Tab";
import React from "react";
import AuditLog from "./AuditLog";

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
            children: <AuditLog />,
          },
        ]}
      />
    </div>
  );
};

export default Page;
