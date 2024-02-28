export const schema = /* GraphQL */ `
  type Query {
    hello: String
    boards: [Board!]!
    board(boardKey: String!): Board
    auditLogs: [AuditLog!]
  }

  type Board {
    id: ID!
    name: String!
    boardKey: String!
    localRule: String
    threadCount: Int!
    threads(threadNumber: String): [Thread!]!
    archivedThreads(
      page: Int
      query: String
      threadId: String
    ): [ArchivedThread!]!
  }

  type Thread {
    threadNumber: String!
    title: String!
    responseCount: Int!
    lastModified: String!
    boardId: Int!
    nonAuthThread: Int!
    archived: Int!
    active: Int!
    authedCookie: String
    responses(id: Int): [Res!]!
    modulo: Int!
  }

  type Res {
    id: ID!
    name: String
    mail: String
    date: String!
    authorId: String
    body: String!
    threadId: String!
    ipAddr: String!
    authedToken: String
    timestamp: Int!
    boardId: Int!
    isAbone: Boolean!
  }

  type ArchivedThread {
    threadNumber: String!
    title: String!
    responseCount: Int!
    boardId: Int!
    lastModified: String!
    responses: [ArchivedRes!]!
  }

  type ArchivedRes {
    name: String
    mail: String
    date: String!
    authorId: String
    body: String!
    ipAddr: String!
    authedToken: String
    isAbone: Boolean!
  }

  type AuditLog {
    id: Int!
    userEmail: String!
    usedPermission: String!
    info: String!
    ipAddr: String!
    timestamp: String!
  }

  type Mutation {
    updateResponse(res: ResInput!): Res!
    deleteAuthedToken(token: String!, usingOriginIp: Boolean!): Boolean!
  }

  input ResInput {
    id: ID!
    name: String
    mail: String
    body: String!
    threadId: String!
    boardId: Int!
    isAbone: Boolean
  }
`;
