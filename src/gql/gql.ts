/* eslint-disable */
import * as types from "./graphql";
import { TypedDocumentNode as DocumentNode } from "@graphql-typed-document-node/core";

/**
 * Map of all GraphQL operations in the project.
 *
 * This map has several performance disadvantages:
 * 1. It is not tree-shakeable, so it will include all operations in the project.
 * 2. It is not minifiable, so the string of a GraphQL query will be multiple times inside the bundle.
 * 3. It does not support dead code elimination, so it will add unused operations.
 *
 * Therefore it is highly recommended to use the babel or swc plugin for production.
 */
const documents = {
  "mutation DeleteAuthedToken($token: String!, $usingOriginIp: Boolean!) {\n  deleteAuthedToken(token: $token, usingOriginIp: $usingOriginIp)\n}":
    types.DeleteAuthedTokenDocument,
  "query GetArchivedThreadData($boardKey: String!, $threadId: String!) {\n  board(boardKey: $boardKey) {\n    id\n    archivedThreads(threadId: $threadId) {\n      threadNumber\n      title\n      responseCount\n      lastModified\n      boardId\n      responses {\n        name\n        mail\n        date\n        authorId\n        body\n        isAbone\n        ipAddr\n        authedToken\n      }\n    }\n  }\n}":
    types.GetArchivedThreadDataDocument,
  "query GetArchivedThreads($boardKey: String!, $page: Int!) {\n  board(boardKey: $boardKey) {\n    id\n    archivedThreads(page: $page) {\n      threadNumber\n      title\n      responseCount\n      lastModified\n      boardId\n    }\n  }\n}":
    types.GetArchivedThreadsDocument,
  "query GetArchivedThreadsByQuery($boardKey: String!, $page: Int!, $query: String!) {\n  board(boardKey: $boardKey) {\n    id\n    archivedThreads(page: $page, query: $query) {\n      threadNumber\n      title\n      responseCount\n      lastModified\n      boardId\n    }\n  }\n}":
    types.GetArchivedThreadsByQueryDocument,
  "query GetBoards {\n  boards {\n    id\n    name\n    boardKey\n    threadCount\n  }\n}":
    types.GetBoardsDocument,
  "query GetThreadData($boardKey: String!, $threadId: String!) {\n  board(boardKey: $boardKey) {\n    id\n    threads(threadNumber: $threadId) {\n      threadNumber\n      title\n      responseCount\n      lastModified\n      archived\n      active\n      authedCookie\n      modulo\n      responses {\n        id\n        name\n        mail\n        date\n        authorId\n        body\n        threadId\n        ipAddr\n        authedToken\n        timestamp\n        isAbone\n        boardId\n      }\n    }\n  }\n}":
    types.GetThreadDataDocument,
  "query GetThreads($boardKey: String!) {\n  board(boardKey: $boardKey) {\n    id\n    threads {\n      threadNumber\n      title\n      responseCount\n      lastModified\n      archived\n      active\n      authedCookie\n      modulo\n    }\n  }\n}":
    types.GetThreadsDocument,
  "mutation UpdateResponse($res: ResInput!) {\n  updateResponse(res: $res) {\n    id\n    name\n    mail\n    body\n    threadId\n    boardId\n    isAbone\n  }\n}":
    types.UpdateResponseDocument,
};

/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 *
 *
 * @example
 * ```ts
 * const query = gql(`query GetUser($id: ID!) { user(id: $id) { name } }`);
 * ```
 *
 * The query argument is unknown!
 * Please regenerate the types.
 */
export function gql(source: string): unknown;

/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(
  source: "mutation DeleteAuthedToken($token: String!, $usingOriginIp: Boolean!) {\n  deleteAuthedToken(token: $token, usingOriginIp: $usingOriginIp)\n}",
): (typeof documents)["mutation DeleteAuthedToken($token: String!, $usingOriginIp: Boolean!) {\n  deleteAuthedToken(token: $token, usingOriginIp: $usingOriginIp)\n}"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(
  source: "query GetArchivedThreadData($boardKey: String!, $threadId: String!) {\n  board(boardKey: $boardKey) {\n    id\n    archivedThreads(threadId: $threadId) {\n      threadNumber\n      title\n      responseCount\n      lastModified\n      boardId\n      responses {\n        name\n        mail\n        date\n        authorId\n        body\n        isAbone\n        ipAddr\n        authedToken\n      }\n    }\n  }\n}",
): (typeof documents)["query GetArchivedThreadData($boardKey: String!, $threadId: String!) {\n  board(boardKey: $boardKey) {\n    id\n    archivedThreads(threadId: $threadId) {\n      threadNumber\n      title\n      responseCount\n      lastModified\n      boardId\n      responses {\n        name\n        mail\n        date\n        authorId\n        body\n        isAbone\n        ipAddr\n        authedToken\n      }\n    }\n  }\n}"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(
  source: "query GetArchivedThreads($boardKey: String!, $page: Int!) {\n  board(boardKey: $boardKey) {\n    id\n    archivedThreads(page: $page) {\n      threadNumber\n      title\n      responseCount\n      lastModified\n      boardId\n    }\n  }\n}",
): (typeof documents)["query GetArchivedThreads($boardKey: String!, $page: Int!) {\n  board(boardKey: $boardKey) {\n    id\n    archivedThreads(page: $page) {\n      threadNumber\n      title\n      responseCount\n      lastModified\n      boardId\n    }\n  }\n}"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(
  source: "query GetArchivedThreadsByQuery($boardKey: String!, $page: Int!, $query: String!) {\n  board(boardKey: $boardKey) {\n    id\n    archivedThreads(page: $page, query: $query) {\n      threadNumber\n      title\n      responseCount\n      lastModified\n      boardId\n    }\n  }\n}",
): (typeof documents)["query GetArchivedThreadsByQuery($boardKey: String!, $page: Int!, $query: String!) {\n  board(boardKey: $boardKey) {\n    id\n    archivedThreads(page: $page, query: $query) {\n      threadNumber\n      title\n      responseCount\n      lastModified\n      boardId\n    }\n  }\n}"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(
  source: "query GetBoards {\n  boards {\n    id\n    name\n    boardKey\n    threadCount\n  }\n}",
): (typeof documents)["query GetBoards {\n  boards {\n    id\n    name\n    boardKey\n    threadCount\n  }\n}"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(
  source: "query GetThreadData($boardKey: String!, $threadId: String!) {\n  board(boardKey: $boardKey) {\n    id\n    threads(threadNumber: $threadId) {\n      threadNumber\n      title\n      responseCount\n      lastModified\n      archived\n      active\n      authedCookie\n      modulo\n      responses {\n        id\n        name\n        mail\n        date\n        authorId\n        body\n        threadId\n        ipAddr\n        authedToken\n        timestamp\n        isAbone\n        boardId\n      }\n    }\n  }\n}",
): (typeof documents)["query GetThreadData($boardKey: String!, $threadId: String!) {\n  board(boardKey: $boardKey) {\n    id\n    threads(threadNumber: $threadId) {\n      threadNumber\n      title\n      responseCount\n      lastModified\n      archived\n      active\n      authedCookie\n      modulo\n      responses {\n        id\n        name\n        mail\n        date\n        authorId\n        body\n        threadId\n        ipAddr\n        authedToken\n        timestamp\n        isAbone\n        boardId\n      }\n    }\n  }\n}"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(
  source: "query GetThreads($boardKey: String!) {\n  board(boardKey: $boardKey) {\n    id\n    threads {\n      threadNumber\n      title\n      responseCount\n      lastModified\n      archived\n      active\n      authedCookie\n      modulo\n    }\n  }\n}",
): (typeof documents)["query GetThreads($boardKey: String!) {\n  board(boardKey: $boardKey) {\n    id\n    threads {\n      threadNumber\n      title\n      responseCount\n      lastModified\n      archived\n      active\n      authedCookie\n      modulo\n    }\n  }\n}"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(
  source: "mutation UpdateResponse($res: ResInput!) {\n  updateResponse(res: $res) {\n    id\n    name\n    mail\n    body\n    threadId\n    boardId\n    isAbone\n  }\n}",
): (typeof documents)["mutation UpdateResponse($res: ResInput!) {\n  updateResponse(res: $res) {\n    id\n    name\n    mail\n    body\n    threadId\n    boardId\n    isAbone\n  }\n}"];

export function gql(source: string) {
  return (documents as any)[source] ?? {};
}

export type DocumentType<TDocumentNode extends DocumentNode<any, any>> =
  TDocumentNode extends DocumentNode<infer TType, any> ? TType : never;
