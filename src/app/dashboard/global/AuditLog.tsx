import { DbAuditLog } from "@/interfaces";
import { Table } from "flowbite-react";
import React from "react";
import useSWR from "swr";

const AuditLog = () => {
  const { data: auditLogs } = useSWR<DbAuditLog[]>("/api/audit-logs");
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
        {auditLogs?.map((auditLog) => (
          <Table.Row key={auditLog.id}>
            <Table.Cell>{auditLog.id}</Table.Cell>
            <Table.Cell>{auditLog.user_email}</Table.Cell>
            <Table.Cell>{auditLog.used_permission}</Table.Cell>
            <Table.Cell>{auditLog.info}</Table.Cell>
            <Table.Cell>{auditLog.ip_addr}</Table.Cell>
            <Table.Cell>{auditLog.timestamp}</Table.Cell>
          </Table.Row>
        ))}
      </Table.Body>
    </Table>
  );
};

export default AuditLog;
