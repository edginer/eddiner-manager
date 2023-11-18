import { Database } from "@cloudflare/d1";
import type { R2Bucket } from "@cloudflare/workers-types";

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      DB: Database;
      ADMIN_DB: Database;
      ARCHIVE_BUCKET: R2Bucket;
    }
  }
}

export interface Thread {
  thread_number: string;
  title: string;
  response_count: number;
  last_modified: string;
  board_id: number;
  non_auth_thread: number;
  archived: number;
  active: number;
  authed_cookie?: string;
}

export interface Res {
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

export interface ThreadResResp {
  thread: Thread;
  responses: Res[];
}

export interface ArchivedThread {
  thread_number: string;
  title: string;
  response_count: number;
  board_id: number;
  last_modified: string;
}

export interface Board {
  id: number;
  name: string;
  board_key: string;
  local_rule: string;
}

export interface Log {
  user_id: number;
}

export type Authority =
  | "view-post-info"
  | "delete-post"
  | "revoke-authed-token"
  | "cap-view"
  | "cap-edit"
  | "audit-log-view"
  | "user-edit"
  | "user-view"
  | "global-setting"
  | "arbitary-sql";

export interface AdminUser {
  id: number;
  authority: Authority[];
  userName: string;
}
