import { ArchivedThread, Res } from "@/gql/graphql";
import { ArchiveRes as ArchivedRes, DbRes } from "@/interfaces";
import { Database } from "@cloudflare/d1";
import { R2Bucket } from "@cloudflare/workers-types";

export interface ArchivedThreadRepository {
  headArchivedThread(
    boardId: number,
    threadId: string
  ): Promise<ArchivedThread | undefined>;

  getArchivedThread(
    boardId: number,
    threadId: string
  ): Promise<[ArchivedThread, ArchivedRes[]]>;

  getAdminArchivedThread(
    boardId: number,
    threadId: string
  ): Promise<[ArchivedThread, Res[]]>;
}

export class ArchivedThreadRepositoryImpl implements ArchivedThreadRepository {
  infosDb: Database;
  threadsDb: Database;
  responsesDbs: Database[];
  datBucket: R2Bucket;

  constructor() {
    this.infosDb = process.env.DB;
    this.threadsDb = process.env.DB_THREADS;
    this.responsesDbs = [
      process.env.DB_RESPONSES,
      process.env.DB_RESPONSES_2,
      process.env.DB_RESPONSES_3,
    ];
    this.datBucket = process.env.ARCHIVE_BUCKET;
  }

  async headArchivedThread(
    boardId: number,
    threadId: string
  ): Promise<ArchivedThread | undefined> {
    const thread = await this.infosDb
      .prepare(
        "SELECT * FROM archives WHERE board_id = ? AND thread_number = ?"
      )
      .bind(boardId, threadId)
      .first();

    if (thread == null) {
      return undefined;
    }
    return thread as ArchivedThread;
  }

  async getArchivedThread(
    boardId: number,
    threadId: string
  ): Promise<[ArchivedThread, ArchivedRes[]]> {
    const thread = await this.headArchivedThread(boardId, threadId);

    if (thread == null) {
      throw new Error("Thread not found");
    }

    const datFile = await this.datBucket.get(
      `${thread.boardId}/dat/${threadId}.dat`
    );
    if (datFile == null) {
      throw new Error(
        `Dat file is not found: ${thread.boardId}/dat/${threadId}.dat`
      );
    }
    const datText = await datFile.text();
    const reses = convertDatFileToRes(datText);

    return [thread, reses];
  }

  async getAdminArchivedThread(
    boardId: number,
    threadId: string
  ): Promise<[ArchivedThread, Res[]]> {
    const thread = await this.headArchivedThread(boardId, threadId);

    if (thread == null) {
      throw new Error("Thread not found");
    }

    const datFile = await this.datBucket.get(
      `${thread.boardId}/admin/${threadId}.dat`
    );
    if (datFile == null) {
      throw new Error(
        `Dat file is not found: ${thread.boardId}/admin/${threadId}.dat`
      );
    }
    const datText = await datFile.text();
    const reses = convertAdminDatFileToAdminRes(
      thread.boardId,
      thread.threadNumber,
      datText
    );

    return [thread, reses];
  }
}

const convertDatFileToRes = (datFile: string): ArchivedRes[] => {
  return (
    datFile
      .split("\n")
      .map((line, _) => {
        const split = line.split("<>");
        if (split.length < 5) {
          return null;
        }

        const [name, mail, dateAndAuthorId, body] = split;
        const dateAndauthorIdSplit = dateAndAuthorId.split(" ID:");
        const res: ArchivedRes = {
          name,
          mail,
          date: dateAndauthorIdSplit[0],
          authorId: dateAndauthorIdSplit[1],
          body,
          isAbone:
            dateAndauthorIdSplit[1] === "" &&
            name === "あぼーん" &&
            body.trim() === "あぼーん",
        };
        return res;
      })
      // SAFETY: null is filtered out
      .filter((res) => res != null) as ArchivedRes[]
  );
};

const convertAdminDatFileToAdminRes = (
  boardId: number,
  threadId: string,
  adminDatFile: string
): Res[] => {
  return (
    adminDatFile
      .split("\n")
      .map((line, idx) => {
        const split = line.split("<>");
        if (split.length < 6) {
          return null;
        }

        const [name, mail, dateAndauthorId, ipAddr, authedToken, body] = split;
        const dateAndauthorIdSplit = dateAndauthorId.split(" ID:");
        const res: Res = {
          name,
          mail,
          date: dateAndauthorIdSplit[0],
          authorId: dateAndauthorIdSplit[1],
          ipAddr,
          authedToken,
          body,
          timestamp: 0,
          threadId,
          isAbone: false,
          boardId,
          id: idx.toString(),
        };
        return res;
      })
      // SAFETY: null is filtered out
      .filter((res) => res != null) as Res[]
  );
};
