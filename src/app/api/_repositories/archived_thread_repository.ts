import { Res } from "@/gql/graphql";
import { ArchivedRes } from "@/interfaces";
import { Database } from "@cloudflare/d1";
import { R2Bucket } from "@cloudflare/workers-types";
import { BbsRepository } from "./bbs_repository";

export interface ArchivedThreadRepository {
  getArchivedThreadData(
    boardId: number,
    threadId: string
  ): Promise<ArchivedRes[]>;

  getAdminArchivedThreadData(boardId: number, threadId: string): Promise<Res[]>;
}

export class ArchivedThreadRepositoryImpl implements ArchivedThreadRepository {
  infosDb: Database;
  threadsDb: Database;
  responsesDbs: Database[];
  datBucket: R2Bucket;
  bbsRepo: BbsRepository;

  boardIdToBoardKey: Map<number, string> = new Map();

  constructor(bbsRepo: BbsRepository) {
    this.infosDb = process.env.DB;
    this.threadsDb = process.env.DB_THREADS;
    this.responsesDbs = [
      process.env.DB_RESPONSES,
      process.env.DB_RESPONSES_2,
      process.env.DB_RESPONSES_3,
    ];
    this.datBucket = process.env.ARCHIVE_BUCKET;
    this.bbsRepo = bbsRepo;
  }

  async getArchivedThreadData(
    boardId: number,
    threadId: string
  ): Promise<ArchivedRes[]> {
    const thread = await this.bbsRepo.headArchivedThread(boardId, threadId);
    const boardKey = await this.getBoardKey(boardId);

    if (thread == null) {
      throw new Error("Thread not found");
    }

    const datFile = await this.datBucket.get(`${boardKey}/dat/${threadId}.dat`);
    if (datFile == null) {
      throw new Error(`Dat file is not found: ${boardKey}/dat/${threadId}.dat`);
    }
    const datText = await datFile.text();
    const reses = convertDatFileToRes(datText);

    return reses;
  }

  async getAdminArchivedThreadData(
    boardId: number,
    threadId: string
  ): Promise<Res[]> {
    const thread = await this.bbsRepo.headArchivedThread(boardId, threadId);
    const boardKey = await this.getBoardKey(boardId);

    if (thread == null) {
      throw new Error("Thread not found");
    }

    const datFile = await this.datBucket.get(
      `${boardKey}/admin/${threadId}.dat`
    );
    if (datFile == null) {
      throw new Error(
        `Dat file is not found: ${boardKey}/admin/${threadId}.dat`
      );
    }
    const datText = await datFile.text();
    const reses = convertAdminDatFileToAdminRes(
      thread.boardId,
      thread.threadNumber,
      datText
    );

    return reses;
  }

  private async getBoardKey(
    boardId: number,
    cache: boolean = true
  ): Promise<string> {
    if (cache) {
      const boardKey = this.boardIdToBoardKey.get(boardId);
      if (boardKey != null) {
        return boardKey;
      }
    }

    const boards = await this.bbsRepo.getBoards2();
    const board = boards.find((b) => b.id === boardId);
    if (board == null) {
      throw new Error("Board not found");
    }
    this.boardIdToBoardKey.set(boardId, board.boardKey);
    return board.boardKey;
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
