import { gql } from "@/gql";
import { useSuspenseQuery } from "@apollo/client";
import { Table } from "flowbite-react";
import React from "react";

const GET_AUDIT_LOGS = gql(`query GetAuditLogs {
  auditLogs {
    id
    userEmail
    usedPermission
    info
    ipAddr
    timestamp
  }
}`);

const AuditLog = () => {
  const { data: auditLogs } = useSuspenseQuery(GET_AUDIT_LOGS);
  return (
    <Table>
      <Table.Head>
        <Table.HeadCell>Id</Table.HeadCell>
        <Table.HeadCell>User Email</Table.HeadCell>
        <Table.HeadCell>Used Permission</Table.HeadCell>
        <Table.HeadCell>Detail</Table.HeadCell>
        <Table.HeadCell>IP Address</Table.HeadCell>
        <Table.HeadCell>Timestamp</Table.HeadCell>
      </Table.Head>
      <Table.Body className="divide-y">
        {auditLogs?.auditLogs?.map((auditLog) => (
          <Table.Row key={auditLog.id}>
            <Table.Cell>{auditLog.id}</Table.Cell>
            <Table.Cell>{auditLog.userEmail}</Table.Cell>
            <Table.Cell>{auditLog.usedPermission}</Table.Cell>
            <Table.Cell>{auditLog.info}</Table.Cell>
            <Table.Cell>{auditLog.ipAddr}</Table.Cell>
            <Table.Cell>{auditLog.timestamp}</Table.Cell>
          </Table.Row>
        ))}
      </Table.Body>
    </Table>
  );
};

export default AuditLog;
