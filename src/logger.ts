import { DbAuditLog } from "./interfaces";

export const runtime = "edge";

export const getAuditLogs = async (): Promise<DbAuditLog[] | undefined> => {
  const { results } = await process.env.ADMIN_DB.prepare(
    "SELECT * FROM audit_logs",
  ).all();

  // SAFETY: Database results are fundamentally untrusted, so we cast them to
  return results as unknown as DbAuditLog[];
};

export const addAuditLog = async (
  auditLog: Omit<DbAuditLog, "id" | "timestamp">,
) => {
  console.log(auditLog);
  await process.env.ADMIN_DB.prepare(
    "INSERT INTO audit_logs (user_email, used_permission, info, ip_addr, timestamp) VALUES (?, ?, ?, ?, ?)",
  )
    .bind(
      auditLog.user_email,
      auditLog.used_permission,
      auditLog.info,
      auditLog.ip_addr,
      Date.now().toString(),
    )
    .run();
};
