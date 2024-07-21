import {
  ArchivedThread,
  Board,
  convertNumberToRestrictionType,
  convertRestrictionTypeToNumber,
  DbArchivedThread,
  DbBoard,
  DbNgWord,
  DbRes,
  DbThread,
  NgWord,
  Res,
  Thread,
} from "@/interfaces";
import { Database } from "@cloudflare/d1";

export interface BbsRepository {
  getBoards(): Promise<Board[]>;
  getThreads(boardId: number): Promise<Thread[]>;
  getThreadsCount(boardId: number): Promise<number>;
  getThread(boardId: number, threadId: string): Promise<Thread | undefined>;
  getArchivedThreads(
    boardId: number,
    options: { page?: number; query?: string }
  ): Promise<ArchivedThread[]>;
  getResponses(
    boardId: number,
    threadId: string,
    modulo: number
  ): Promise<Res[]>;
  getResponse(responseId: number, modulo: number): Promise<Res | undefined>;
  updateResponse(
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
  getNgWords(): Promise<NgWord[]>;
  addNgWord(word: Omit<NgWord, "id">): Promise<void>;
  updateNgWord(word: NgWord): Promise<void>;
  deleteNgWord(id: number): Promise<void>;
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

  async getBoards(): Promise<Board[]> {
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

  async getThreads(boardId: number): Promise<Thread[]> {
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

  async getThread(
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

  async getResponse(responseId: number, modulo: number): Promise<Res> {
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
  ): Promise<ArchivedThread[]> {
    const { page, query } = options;
    const parsedPage = page ?? NaN;

    if (query) {
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

  async getNgWords(): Promise<NgWord[]> {
    const { results } = await this.infosDb
      .prepare("SELECT * FROM ng_words")
      .all();

    const dbNgWords = results as unknown[] as DbNgWord[];

    return dbNgWords.map((w) => ({
      id: w.id,
      name: w.name,
      value: w.value,
      restrictionType: convertNumberToRestrictionType(w.restriction_type),
    }));
  }

  async addNgWord(word: NgWord): Promise<void> {
    await this.infosDb
      .prepare(
        "INSERT INTO ng_words (name, value, restriction_type) VALUES (?, ?, ?)"
      )
      .bind(
        word.name,
        word.value,
        convertRestrictionTypeToNumber(word.restrictionType)
      )
      .run();
  }

  async updateNgWord(word: NgWord): Promise<void> {
    await this.infosDb
      .prepare(
        "UPDATE ng_words SET name = ?, value = ?, restriction_type = ? WHERE id = ?"
      )
      .bind(
        word.name,
        word.value,
        convertRestrictionTypeToNumber(word.restrictionType),
        word.id
      )
      .run();
  }

  async deleteNgWord(id: number): Promise<void> {
    await this.infosDb
      .prepare("DELETE FROM ng_words WHERE id = ?")
      .bind(id)
      .run();
  }
}
