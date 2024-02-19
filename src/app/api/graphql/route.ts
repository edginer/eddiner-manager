export const runtime = "edge";

import { createSchema, createYoga } from "graphql-yoga";
import { Authentication, authenticate } from "../authenticate";
import {
  BbsRepository,
  BbsRepositoryImpl,
} from "../_repositories/bbs_repository";
import { schema } from "@/schema";

const generator = (auth: Authentication) => {
  const bbsRepo: BbsRepository = new BbsRepositoryImpl();
  return createYoga({
    schema: createSchema({
      typeDefs: /* GraphQL */ schema,
      resolvers: {
        Query: {
          hello: (_, args) =>
            `Hello from Yoga!, ${args.hello}, ${auth.userEmail} ${auth.permissions}`,
          boards: async (_) => bbsRepo.getBoards2(),
          board: async (_, args) =>
            (await bbsRepo.getBoards2()).filter(
              (b) => b.boardKey === args.boardKey
            )[0],
        },
        Board: {
          threadCount: async (parent) => {
            return await bbsRepo.getThreadsCount(parent.id);
          },
          threads: async (parent, args) => {
            if (args.threadNumber) {
              return [await bbsRepo.getThread2(parent.id, args.threadNumber)];
            } else {
              return await bbsRepo.getThreads2(parent.id);
            }
          },
          archivedThreads: async (parent, args) =>
            await bbsRepo.getArchivedThreads2(parent.id, {
              page: args.page,
              query: args.query,
            }),
        },
        Thread: {
          responses: async (parent, args) => {
            if (args.id) {
              return [await bbsRepo.getResponse2(args.id, parent.modulo)];
            }
            return await bbsRepo.getResponses2(
              parent.boardId,
              parent.threadNumber,
              parent.modulo
            );
          },
        },
        ArchivedThread: {},
        Mutation: {
          updateResponse: async (_, args) => {
            const { res } = args;
            const { name, mail, body, threadId, boardId, isAbone } = res;
            const thread = await bbsRepo.getThread2(boardId, threadId);
            if (!thread) {
              throw new Error("Thread not found");
            }
            await bbsRepo.updateResponse2({
              id: res.id,
              name,
              mail,
              body,
              modulo: thread.modulo,
              isAbone,
            });
            const response = await bbsRepo.getResponse2(res.id, thread.modulo);
            return response;
          },
          deleteAuthedToken: async (_, args) => {
            const { token, usingOriginIp } = args;
            await bbsRepo.deleteAuthedToken(token, usingOriginIp);
            return true;
          },
        },
      },
    }),
    graphqlEndpoint: "/api/graphql",
    fetchAPI: { Response },
  });
};

export const GET = async (request: Request) => {
  try {
    const auth = await authenticate(request);
    const { handleRequest } = generator(auth);
    return handleRequest(request, {});
  } catch (e) {
    return e as Response;
  }
};

export const POST = async (request: Request) => {
  try {
    const auth = await authenticate(request);
    const { handleRequest } = generator(auth);
    return handleRequest(request, {});
  } catch (e) {
    return e as Response;
  }
};
