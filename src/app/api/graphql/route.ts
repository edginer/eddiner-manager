export const runtime = "edge";

import { createSchema, createYoga } from "graphql-yoga";
import { Authentication, authenticate } from "../authenticate";
import {
  BbsRepository,
  BbsRepositoryImpl,
} from "../_repositories/bbs_repository";
import { schema } from "@/schema";
import { ArchivedThreadRepositoryImpl } from "../_repositories/archived_thread_repository";
import { ArchivedRes, Permission, Res } from "@/interfaces";
import { ArchivedRes as ArchivedResGql, AuditLog } from "@/gql/graphql";
import { addAuditLog, getAuditLogs } from "@/logger";
import { hasPermission } from "../authorize";

const generator = (auth: Authentication) => {
  const bbsRepo: BbsRepository = new BbsRepositoryImpl();
  return createYoga({
    schema: createSchema({
      typeDefs: /* GraphQL */ schema,
      resolvers: {
        Query: {
          hello: (_, args) =>
            `Hello from Yoga!, ${args.hello}, ${auth.userEmail} ${auth.permissions}`,
          boards: async (_) => bbsRepo.getBoards(),
          board: async (_, args) =>
            (await bbsRepo.getBoards()).filter(
              (b) => b.boardKey === args.boardKey,
            )[0],
          auditLogs: async (_) => {
            if (!hasPermission(auth, "audit-logs:list")) {
              throw new Error("Unauthorized");
            }

            const logs = await getAuditLogs();
            if (logs) {
              return logs.map((x) => ({
                id: x.id,
                userEmail: x.user_email,
                usedPermission: x.used_permission,
                info: x.info,
                ipAddr: x.ip_addr,
                timestamp: x.timestamp,
              })) satisfies AuditLog[];
            } else {
              return undefined;
            }
          },
        },
        Board: {
          threadCount: async (parent) => {
            return await bbsRepo.getThreadsCount(parent.id);
          },
          threads: async (parent, args) => {
            if (args.threadNumber) {
              return [await bbsRepo.getThread(parent.id, args.threadNumber)];
            } else {
              return await bbsRepo.getThreads(parent.id);
            }
          },
          archivedThreads: async (parent, args) => {
            if (args.threadId) {
              return [
                await bbsRepo.headArchivedThread(parent.id, args.threadId),
              ];
            } else {
              return await bbsRepo.getArchivedThreads(parent.id, {
                page: args.page,
                query: args.query,
              });
            }
          },
        },
        Thread: {
          responses: async (parent, args) => {
            if (args.id) {
              return [await bbsRepo.getResponse(args.id, parent.modulo)];
            }
            return await bbsRepo.getResponses(
              parent.boardId,
              parent.threadNumber,
              parent.modulo,
            );
          },
        },
        ArchivedThread: {
          responses: async (parent) => {
            const archivedThreadRepo = new ArchivedThreadRepositoryImpl(
              bbsRepo,
            );
            const promises = [
              archivedThreadRepo.getArchivedThreadData(
                parent.boardId,
                parent.threadNumber,
              ),
              archivedThreadRepo.getAdminArchivedThreadData(
                parent.boardId,
                parent.threadNumber,
              ),
            ];
            const [archivedRes, adminArchivedRes] = await Promise.all(promises);
            const result = [];

            for (let i = 0; i < adminArchivedRes.length; i++) {
              const aRes = archivedRes[i] as ArchivedRes;
              const aaRes = adminArchivedRes[i] as Res;
              result.push({
                ...aRes,
                ipAddr: aaRes.ipAddr,
                authedToken: aaRes.authedToken,
              });
            }

            return result satisfies ArchivedResGql[];
          },
        },
        Mutation: {
          updateResponse: async (_, args) => {
            const { res } = args;
            const { name, mail, body, threadId, boardId, isAbone } = res;
            const thread = await bbsRepo.getThread(boardId, threadId);
            if (!thread) {
              throw new Error("Thread not found");
            }

            if (name == null && mail == null && body == null) {
              if (!hasPermission(auth, "responses:delete")) {
                throw new Error("Unauthorized");
              }
            } else {
              if (!hasPermission(auth, "responses:edit")) {
                throw new Error("Unauthorized");
              }
            }

            await bbsRepo.updateResponse({
              id: res.id,
              name,
              mail,
              body,
              modulo: thread.modulo,
              isAbone,
            });
            const response = await bbsRepo.getResponse(res.id, thread.modulo);

            let perm: Permission = "responses:edit";
            if (name == null && mail == null && body == null) {
              perm = "responses:delete";
            }

            await addAuditLog({
              user_email: auth.userEmail,
              used_permission: perm,
              info: JSON.stringify(res),
              ip_addr: auth.ipAddr,
            });

            return response;
          },
          deleteAuthedToken: async (_, args) => {
            const { token, usingOriginIp } = args;
            if (
              !usingOriginIp &&
              !hasPermission(auth, "authed-tokens:delete")
            ) {
              throw new Error("Unauthorized");
            }
            if (
              usingOriginIp &&
              !hasPermission(auth, "authed-tokens:delete-by-ip")
            ) {
              throw new Error("Unauthorized");
            }

            await bbsRepo.deleteAuthedToken(token, usingOriginIp);

            let perm: Permission = "authed-tokens:delete";
            if (usingOriginIp) {
              perm = "authed-tokens:delete-by-ip";
            }

            await addAuditLog({
              user_email: auth.userEmail,
              used_permission: perm,
              info: `{"authedToken": "${token}"}`,
              ip_addr: auth.ipAddr,
            });

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
