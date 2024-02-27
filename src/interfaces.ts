import { Database } from "@cloudflare/d1";
import type { R2Bucket } from "@cloudflare/workers-types";

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      DB: Database;
      DB_RESPONSES: Database;
      DB_THREADS: Database;
      DB_RESPONSES_2: Database;
      DB_RESPONSES_3: Database;
      ADMIN_DB: Database;
      ARCHIVE_BUCKET: R2Bucket;
    }
  }
}

export interface DbThread {
  thread_number: string;
  title: string;
  response_count: number;
  last_modified: string;
  board_id: number;
  non_auth_thread: number;
  archived: number;
  active: number;
  authed_cookie?: string;
  modulo: number;
}

export interface Thread {
  threadNumber: string;
  title: string;
  responseCount: number;
  lastModified: string;
  boardId: number;
  nonAuthThread: number;
  archived: number;
  active: number;
  authedCookie?: string;
  modulo: number;
}

export interface DbRes {
  id: number;
  name?: string;
  mail?: string;
  date: string;
  author_id?: string;
  body: string;
  thread_id: string;
  ip_addr: string;
  authed_token?: string;
  timestamp: number;
  board_id: number;
  is_abone: number;
}

export interface Res {
  id: number;
  name?: string;
  mail?: string;
  date: string;
  authorId?: string;
  body: string;
  threadId: string;
  ipAddr: string;
  authedToken?: string;
  timestamp: number;
  boardId: number;
  isAbone: boolean;
}

export interface ThreadResResp {
  thread: DbThread;
  responses: DbRes[];
}

export interface DbArchivedThread {
  thread_number: string;
  title: string;
  response_count: number;
  board_id: number;
  last_modified: string;
}

export interface ArchivedThread {
  threadNumber: string;
  title: string;
  responseCount: number;
  boardId: number;
  lastModified: string;
}

export interface DbBoard {
  id: number;
  name: string;
  board_key: string;
  local_rule: string;
}

export interface Board {
  id: number;
  name: string;
  boardKey: string;
  localRule: string;
}

export interface DbAuditLog {
  id: number;
  user_email: string;
  used_permission: Permission | "login" | "logout";
  info: string;
  ip_addr: string;
  timestamp: string;
}

export interface ArchivedRes {
  name?: string;
  mail?: string;
  date: string;
  authorId?: string;
  body: string;
  isAbone: boolean;
}

export type AllPermission = "all";
export type MePermission = "me";
export type Permission =
  | `boards:${BoardsPermission | AllPermission}`
  | `threads:${ThreadsPermission | AllPermission}`
  | `archives:${ArchivesPermission | AllPermission}`
  | `responses:${ResponsesPermission | AllPermission}`
  | `authed-tokens:${AuthedTokensPermission | AllPermission}`
  | `admin-users:${AdminUsersPermission | AllPermission}`
  | `caps:${CapsPermission | AllPermission}`
  | `caps:${CapsPermission}:${MePermission}`
  | `roles:${RolesPermission | AllPermission}`
  | `audit-logs:${AuditLogsPermission | AllPermission}`
  | AllPermission;

export type BoardsPermission = "create" | "list";
export type ThreadsPermission =
  | "list"
  | "delete"
  | "archive"
  | "show"
  | "fix-unarchived";
export type ArchivesPermission = "list" | "delete" | "search";
export type ResponsesPermission =
  | "delete"
  | "edit"
  | "show"
  | "show-identities";
export type AuthedTokensPermission = "delete" | "delete-by-ip";
export type AdminUsersPermission =
  | "list"
  | "create"
  | "delete"
  | "edit"
  | "show"
  | "edit-roles";
export type CapsPermission =
  | "list"
  | "create"
  | "delete"
  | "edit"
  | "show"
  | "edit-name"
  | "edit-password";
export type RolesPermission = "list" | "create" | "delete" | "edit" | "show";
export type AuditLogsPermission = "list" | "show";
