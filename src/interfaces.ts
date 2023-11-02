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

export interface ArchivedThread {
  thread_number: string;
  title: string;
  response_count: number;
  board_id: number;
  last_modified: string;
}
