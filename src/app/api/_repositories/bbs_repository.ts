import {
  ArchivedThread,
  Board,
  DbArchivedThread,
  DbBoard,
  DbRes,
  DbThread,
  Res,
  Thread,
} from "@/interfaces";
import { Database } from "@cloudflare/d1";

export interface BbsRepository {
  getBoards(): Promise<DbBoard[]>;
  getBoards2(): Promise<Board[]>;
  getThreads(boardId: number): Promise<DbThread[]>;
  getThreads2(boardId: number): Promise<Thread[]>;
  getThreadsCount(boardId: number): Promise<number>;
  getThread(boardId: number, threadId: string): Promise<DbThread | undefined>;
  getThread2(boardId: number, threadId: string): Promise<Thread | undefined>;
  getArchivedThreads(
    boardId: number,
    options: { page?: number; query?: string }
  ): Promise<DbThread[]>;
  getArchivedThreads2(
    boardId: number,
    options: { page?: number; query?: string }
  ): Promise<ArchivedThread[]>;
  getResponses(
    boardId: number,
    threadId: string,
    modulo: number
  ): Promise<DbRes[]>;
  getResponses2(
    boardId: number,
    threadId: string,
    modulo: number
  ): Promise<Res[]>;
  getResponse(responseId: number, modulo: number): Promise<DbRes | undefined>;
  getResponse2(responseId: number, modulo: number): Promise<Res | undefined>;
  updateResponse(response: DbRes, modulo: number): Promise<void>;
  updateResponse2(
    response: Omit<
      Partial<Res> & { id: number; modulo: number },
      "boardId" | "threadId" | "date" | "ipAddr" | "authedToken" | "timestamp"
    >
  ): Promise<void>;
  headArchivedThread(
    boardId: number,
    threadId: string
  ): Promise<ArchivedThread>;
  deleteAuthedToken(
    token: string,
    appliedToAssociatedOriginIp: boolean
  ): Promise<void>;
}

export class BbsRepositoryImpl implements BbsRepository {
  infosDb: Database;
  threadsDb: Database;
  responsesDbs: Database[];

  constructor() {
    this.infosDb = process.env.DB;
    this.threadsDb = process.env.DB_THREADS;
    this.responsesDbs = [
      process.env.DB_RESPONSES,
      process.env.DB_RESPONSES_2,
      process.env.DB_RESPONSES_3,
    ];
  }

  async getBoards() {
    const { results } = await this.infosDb
      .prepare("SELECT * FROM boards")
      .all();

    return results as unknown[] as DbBoard[];
  }

  async getBoards2(): Promise<Board[]> {
    const { results } = await this.infosDb
      .prepare("SELECT * FROM boards")
      .all();

    const dbBoards = results as unknown[] as DbBoard[];

    return dbBoards.map((b) => ({
      id: b.id,
      name: b.name,
      boardKey: b.board_key,
      localRule: b.local_rule,
    }));
  }

  async getThreadsCount(boardId: number): Promise<number> {
    const count = await this.threadsDb
      .prepare("SELECT COUNT(*) FROM threads WHERE board_id = ?")
      .bind(boardId)
      .first();

    return (count as unknown as { "COUNT(*)": number })["COUNT(*)"];
  }

  async getThreads(boardId: number) {
    const { results } = await this.threadsDb
      .prepare("SELECT * FROM threads WHERE board_id = ?")
      .bind(boardId)
      .all();

    return results as unknown[] as DbThread[];
  }

  async getThreads2(boardId: number): Promise<Thread[]> {
    const { results } = await this.threadsDb
      .prepare("SELECT * FROM threads WHERE board_id = ?")
      .bind(boardId)
      .all();

    const dbThreads = results as unknown[] as DbThread[];

    return dbThreads.map((t) => ({
      threadNumber: t.thread_number,
      title: t.title,
      responseCount: t.response_count,
      lastModified: t.last_modified,
      boardId: t.board_id,
      nonAuthThread: t.non_auth_thread,
      archived: t.archived,
      active: t.active,
      authedCookie: t.authed_cookie,
      modulo: t.modulo,
    }));
  }

  async getThread(boardId: number, threadId: string) {
    const thread = await this.threadsDb
      .prepare("SELECT * FROM threads WHERE board_id = ? AND thread_number = ?")
      .bind(boardId, threadId)
      .first();

    return thread as unknown as DbThread | undefined;
  }

  async getThread2(
    boardId: number,
    threadId: string
  ): Promise<Thread | undefined> {
    const thread = await this.threadsDb
      .prepare("SELECT * FROM threads WHERE board_id = ? AND thread_number = ?")
      .bind(boardId, threadId)
      .first();

    const dbThread = thread as unknown as DbThread | undefined;
    return (
      dbThread && {
        threadNumber: dbThread.thread_number,
        title: dbThread.title,
        responseCount: dbThread.response_count,
        lastModified: dbThread.last_modified,
        boardId: dbThread.board_id,
        nonAuthThread: dbThread.non_auth_thread,
        archived: dbThread.archived,
        active: dbThread.active,
        authedCookie: dbThread.authed_cookie,
        modulo: dbThread.modulo,
      }
    );
  }

  async getResponses(
    boardId: number,
    threadId: string,
    modulo: number
  ): Promise<DbRes[]> {
    const { results } = await this.responsesDbs[modulo]
      .prepare(
        "SELECT * FROM responses WHERE board_id = ? AND thread_id = ? ORDER BY id ASC"
      )
      .bind(boardId, threadId)
      .all();

    return results as unknown[] as DbRes[];
  }

  async getResponses2(
    boardId: number,
    threadId: string,
    modulo: number
  ): Promise<Res[]> {
    const { results } = await this.responsesDbs[modulo]
      .prepare(
        "SELECT * FROM responses WHERE board_id = ? AND thread_id = ? ORDER BY id ASC"
      )
      .bind(boardId, threadId)
      .all();

    const dbResponses = results as unknown[] as DbRes[];

    return dbResponses.map((r) => ({
      id: r.id,
      name: r.name,
      mail: r.mail,
      date: r.date,
      authorId: r.author_id,
      body: r.body,
      threadId: r.thread_id,
      ipAddr: r.ip_addr,
      authedToken: r.authed_token,
      timestamp: r.timestamp,
      boardId: r.board_id,
      isAbone: r.is_abone === 1,
    }));
  }

  async getResponse(responseId: number, modulo: number): Promise<DbRes> {
    const response = await this.responsesDbs[modulo]
      .prepare("SELECT * FROM responses WHERE id = ?")
      .bind(responseId)
      .first();

    return response as unknown as DbRes;
  }

  async getResponse2(responseId: number, modulo: number): Promise<Res> {
    const response = await this.responsesDbs[modulo]
      .prepare("SELECT * FROM responses WHERE id = ?")
      .bind(responseId)
      .first();

    const dbResponse = response as unknown as DbRes;
    return {
      id: dbResponse.id,
      name: dbResponse.name,
      mail: dbResponse.mail,
      date: dbResponse.date,
      authorId: dbResponse.author_id,
      body: dbResponse.body,
      threadId: dbResponse.thread_id,
      ipAddr: dbResponse.ip_addr,
      authedToken: dbResponse.authed_token,
      timestamp: dbResponse.timestamp,
      boardId: dbResponse.board_id,
      isAbone: dbResponse.is_abone === 1,
    };
  }

  async updateResponse(
    res: Omit<
      Partial<DbRes> & { id: number },
      | "board_id"
      | "thread_id"
      | "date"
      | "ip_addr"
      | "authed_token"
      | "timestamp"
    >,
    modulo: number
  ): Promise<void> {
    const { id, author_id, name, mail, body, is_abone } = res;
    const columnNames = [];
    const sets: (string | number)[] = [];
    if (author_id) {
      sets.push(author_id);
      columnNames.push("author_id");
    }
    if (name) {
      sets.push(name);
      columnNames.push("name");
    }
    if (mail) {
      sets.push(mail);
      columnNames.push("mail");
    }
    if (body) {
      sets.push(body);
      columnNames.push("body");
    }
    if (is_abone) {
      sets.push(is_abone);
      columnNames.push("is_abone");
    }
    let setString = "";
    for (let i = 0; i < columnNames.length; i++) {
      setString += `${columnNames[i]} = ?`;
      if (i !== sets.length - 1) {
        setString += ", ";
      }
    }
    await this.responsesDbs[modulo]
      .prepare(`UPDATE responses SET ${setString} WHERE id = ?`)
      .bind(...sets, id)
      .run();
  }

  async updateResponse2(
    res: Omit<
      Partial<Res> & { id: number; modulo: number },
      "boardId" | "threadId" | "date" | "ipAddr" | "authedToken" | "timestamp"
    >
  ) {
    const { id, authorId, name, mail, body, isAbone } = res;
    const columnNames = [];
    const sets: (string | number | boolean)[] = [];
    if (authorId) {
      sets.push(authorId);
      columnNames.push("author_id");
    }
    if (name) {
      sets.push(name);
      columnNames.push("name");
    }
    if (mail) {
      sets.push(mail);
      columnNames.push("mail");
    }
    if (body) {
      sets.push(body);
      columnNames.push("body");
    }
    if (isAbone) {
      sets.push(isAbone);
      columnNames.push("is_abone");
    }
    let setString = "";
    for (let i = 0; i < columnNames.length; i++) {
      setString += `${columnNames[i]} = ?`;
      if (i !== sets.length - 1) {
        setString += ", ";
      }
    }
    await this.responsesDbs[res.modulo]
      .prepare(`UPDATE responses SET ${setString} WHERE id = ?`)
      .bind(...sets, id)
      .run();
  }

  async getArchivedThreads(
    boardId: number,
    options: { page?: number; query?: string }
  ) {
    const { page, query } = options;
    const parsedPage = page ?? NaN;

    if (query) {
      const { results } = await this.infosDb
        .prepare(
          "SELECT * FROM archives WHERE board_id = ? AND title LIKE %?% LIMIT 25 OFFSET ?"
        )
        .bind(boardId, query, isNaN(parsedPage) ? 0 : parsedPage * 25)
        .all();

      return results as unknown[] as DbThread[];
    } else {
      const { results } = await this.infosDb
        .prepare("SELECT * FROM archives WHERE board_id = ? LIMIT 25 OFFSET ?")
        .bind(boardId, isNaN(parsedPage) ? 0 : parsedPage * 25)
        .all();

      return results as unknown[] as DbThread[];
    }
  }

  async getArchivedThreads2(
    boardId: number,
    options: { page?: number; query?: string }
  ): Promise<ArchivedThread[]> {
    const { page, query } = options;
    const parsedPage = page ?? NaN;

    if (query) {
      console.log(query);
      console.log(boardId);
      console.log(isNaN(parsedPage) ? 0 : parsedPage * 25);
      const { results } = await this.infosDb
        .prepare(
          "SELECT * FROM archives WHERE board_id = ? AND title LIKE ? LIMIT 25 OFFSET ?"
        )
        .bind(boardId, `%${query}%`, isNaN(parsedPage) ? 0 : parsedPage * 25)
        .all();

      const dbThreads = results as unknown[] as DbArchivedThread[];

      return dbThreads.map((t) => ({
        threadNumber: t.thread_number,
        title: t.title,
        responseCount: t.response_count,
        lastModified: t.last_modified,
        boardId: t.board_id,
      }));
    } else {
      const { results } = await this.infosDb
        .prepare("SELECT * FROM archives WHERE board_id = ? LIMIT 25 OFFSET ?")
        .bind(boardId, isNaN(parsedPage) ? 0 : parsedPage * 25)
        .all();

      const dbThreads = results as unknown[] as DbArchivedThread[];

      return dbThreads.map((t) => ({
        threadNumber: t.thread_number,
        title: t.title,
        responseCount: t.response_count,
        lastModified: t.last_modified,
        boardId: t.board_id,
      }));
    }
  }

  async headArchivedThread(
    boardId: number,
    threadId: string
  ): Promise<ArchivedThread> {
    const thread = (await this.infosDb
      .prepare(
        "SELECT * FROM archives WHERE board_id = ? AND thread_number = ?"
      )
      .bind(boardId, threadId)
      .first()) as unknown as DbArchivedThread;

    return {
      threadNumber: thread.thread_number,
      title: thread.title,
      responseCount: thread.response_count,
      lastModified: thread.last_modified,
      boardId: thread.board_id,
    };
  }

  async deleteAuthedToken(
    token: string,
    appliedToAssociatedOriginIp: boolean
  ): Promise<void> {
    if (appliedToAssociatedOriginIp) {
      await process.env.DB.prepare(
        `UPDATE authed_cookies SET authed = 0 WHERE origin_ip 
          IN (SELECT origin_ip FROM authed_cookies WHERE cookie = ?)`
      )
        .bind(token)
        .run();
    } else {
      await process.env.DB.prepare(
        "UPDATE authed_cookies SET authed = 0 WHERE cookie = ?"
      )
        .bind(token)
        .run();
    }
  }
}