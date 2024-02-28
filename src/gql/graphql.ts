/* eslint-disable */
import { TypedDocumentNode as DocumentNode } from "@graphql-typed-document-node/core";
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = {
  [K in keyof T]: T[K];
};
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & {
  [SubKey in K]?: Maybe<T[SubKey]>;
};
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & {
  [SubKey in K]: Maybe<T[SubKey]>;
};
export type MakeEmpty<
  T extends { [key: string]: unknown },
  K extends keyof T,
> = { [_ in K]?: never };
export type Incremental<T> =
  | T
  | {
      [P in keyof T]?: P extends " $fragmentName" | "__typename" ? T[P] : never;
    };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string };
  String: { input: string; output: string };
  Boolean: { input: boolean; output: boolean };
  Int: { input: number; output: number };
  Float: { input: number; output: number };
};

export type ArchivedRes = {
  __typename?: "ArchivedRes";
  authedToken?: Maybe<Scalars["String"]["output"]>;
  authorId?: Maybe<Scalars["String"]["output"]>;
  body: Scalars["String"]["output"];
  date: Scalars["String"]["output"];
  ipAddr: Scalars["String"]["output"];
  isAbone: Scalars["Boolean"]["output"];
  mail?: Maybe<Scalars["String"]["output"]>;
  name?: Maybe<Scalars["String"]["output"]>;
};

export type ArchivedThread = {
  __typename?: "ArchivedThread";
  boardId: Scalars["Int"]["output"];
  lastModified: Scalars["String"]["output"];
  responseCount: Scalars["Int"]["output"];
  responses: Array<ArchivedRes>;
  threadNumber: Scalars["String"]["output"];
  title: Scalars["String"]["output"];
};

export type AuditLog = {
  __typename?: "AuditLog";
  id: Scalars["Int"]["output"];
  info: Scalars["String"]["output"];
  ipAddr: Scalars["String"]["output"];
  timestamp: Scalars["String"]["output"];
  usedPermission: Scalars["String"]["output"];
  userEmail: Scalars["String"]["output"];
};

export type Board = {
  __typename?: "Board";
  archivedThreads: Array<ArchivedThread>;
  boardKey: Scalars["String"]["output"];
  id: Scalars["ID"]["output"];
  localRule?: Maybe<Scalars["String"]["output"]>;
  name: Scalars["String"]["output"];
  threadCount: Scalars["Int"]["output"];
  threads: Array<Thread>;
};

export type BoardArchivedThreadsArgs = {
  page?: InputMaybe<Scalars["Int"]["input"]>;
  query?: InputMaybe<Scalars["String"]["input"]>;
  threadId?: InputMaybe<Scalars["String"]["input"]>;
};

export type BoardThreadsArgs = {
  threadNumber?: InputMaybe<Scalars["String"]["input"]>;
};

export type Mutation = {
  __typename?: "Mutation";
  deleteAuthedToken: Scalars["Boolean"]["output"];
  updateResponse: Res;
};

export type MutationDeleteAuthedTokenArgs = {
  token: Scalars["String"]["input"];
  usingOriginIp: Scalars["Boolean"]["input"];
};

export type MutationUpdateResponseArgs = {
  res: ResInput;
};

export type Query = {
  __typename?: "Query";
  auditLogs?: Maybe<Array<AuditLog>>;
  board?: Maybe<Board>;
  boards: Array<Board>;
  hello?: Maybe<Scalars["String"]["output"]>;
};

export type QueryBoardArgs = {
  boardKey: Scalars["String"]["input"];
};

export type Res = {
  __typename?: "Res";
  authedToken?: Maybe<Scalars["String"]["output"]>;
  authorId?: Maybe<Scalars["String"]["output"]>;
  boardId: Scalars["Int"]["output"];
  body: Scalars["String"]["output"];
  date: Scalars["String"]["output"];
  id: Scalars["ID"]["output"];
  ipAddr: Scalars["String"]["output"];
  isAbone: Scalars["Boolean"]["output"];
  mail?: Maybe<Scalars["String"]["output"]>;
  name?: Maybe<Scalars["String"]["output"]>;
  threadId: Scalars["String"]["output"];
  timestamp: Scalars["Int"]["output"];
};

export type ResInput = {
  boardId: Scalars["Int"]["input"];
  body: Scalars["String"]["input"];
  id: Scalars["ID"]["input"];
  isAbone?: InputMaybe<Scalars["Boolean"]["input"]>;
  mail?: InputMaybe<Scalars["String"]["input"]>;
  name?: InputMaybe<Scalars["String"]["input"]>;
  threadId: Scalars["String"]["input"];
};

export type Thread = {
  __typename?: "Thread";
  active: Scalars["Int"]["output"];
  archived: Scalars["Int"]["output"];
  authedCookie?: Maybe<Scalars["String"]["output"]>;
  boardId: Scalars["Int"]["output"];
  lastModified: Scalars["String"]["output"];
  modulo: Scalars["Int"]["output"];
  nonAuthThread: Scalars["Int"]["output"];
  responseCount: Scalars["Int"]["output"];
  responses: Array<Res>;
  threadNumber: Scalars["String"]["output"];
  title: Scalars["String"]["output"];
};

export type ThreadResponsesArgs = {
  id?: InputMaybe<Scalars["Int"]["input"]>;
};

export type DeleteAuthedTokenMutationVariables = Exact<{
  token: Scalars["String"]["input"];
  usingOriginIp: Scalars["Boolean"]["input"];
}>;

export type DeleteAuthedTokenMutation = {
  __typename?: "Mutation";
  deleteAuthedToken: boolean;
};

export type GetArchivedThreadDataQueryVariables = Exact<{
  boardKey: Scalars["String"]["input"];
  threadId: Scalars["String"]["input"];
}>;

export type GetArchivedThreadDataQuery = {
  __typename?: "Query";
  board?: {
    __typename?: "Board";
    id: string;
    archivedThreads: Array<{
      __typename?: "ArchivedThread";
      threadNumber: string;
      title: string;
      responseCount: number;
      lastModified: string;
      boardId: number;
      responses: Array<{
        __typename?: "ArchivedRes";
        name?: string | null;
        mail?: string | null;
        date: string;
        authorId?: string | null;
        body: string;
        isAbone: boolean;
        ipAddr: string;
        authedToken?: string | null;
      }>;
    }>;
  } | null;
};

export type GetArchivedThreadsQueryVariables = Exact<{
  boardKey: Scalars["String"]["input"];
  page: Scalars["Int"]["input"];
}>;

export type GetArchivedThreadsQuery = {
  __typename?: "Query";
  board?: {
    __typename?: "Board";
    id: string;
    archivedThreads: Array<{
      __typename?: "ArchivedThread";
      threadNumber: string;
      title: string;
      responseCount: number;
      lastModified: string;
      boardId: number;
    }>;
  } | null;
};

export type GetArchivedThreadsByQueryQueryVariables = Exact<{
  boardKey: Scalars["String"]["input"];
  page: Scalars["Int"]["input"];
  query: Scalars["String"]["input"];
}>;

export type GetArchivedThreadsByQueryQuery = {
  __typename?: "Query";
  board?: {
    __typename?: "Board";
    id: string;
    archivedThreads: Array<{
      __typename?: "ArchivedThread";
      threadNumber: string;
      title: string;
      responseCount: number;
      lastModified: string;
      boardId: number;
    }>;
  } | null;
};

export type GetAuditLogsQueryVariables = Exact<{ [key: string]: never }>;

export type GetAuditLogsQuery = {
  __typename?: "Query";
  auditLogs?: Array<{
    __typename?: "AuditLog";
    id: number;
    userEmail: string;
    usedPermission: string;
    info: string;
    ipAddr: string;
    timestamp: string;
  }> | null;
};

export type GetBoardsQueryVariables = Exact<{ [key: string]: never }>;

export type GetBoardsQuery = {
  __typename?: "Query";
  boards: Array<{
    __typename?: "Board";
    id: string;
    name: string;
    boardKey: string;
    threadCount: number;
  }>;
};

export type GetThreadDataQueryVariables = Exact<{
  boardKey: Scalars["String"]["input"];
  threadId: Scalars["String"]["input"];
}>;

export type GetThreadDataQuery = {
  __typename?: "Query";
  board?: {
    __typename?: "Board";
    id: string;
    threads: Array<{
      __typename?: "Thread";
      threadNumber: string;
      title: string;
      responseCount: number;
      lastModified: string;
      archived: number;
      active: number;
      authedCookie?: string | null;
      modulo: number;
      responses: Array<{
        __typename?: "Res";
        id: string;
        name?: string | null;
        mail?: string | null;
        date: string;
        authorId?: string | null;
        body: string;
        threadId: string;
        ipAddr: string;
        authedToken?: string | null;
        timestamp: number;
        isAbone: boolean;
        boardId: number;
      }>;
    }>;
  } | null;
};

export type GetThreadsQueryVariables = Exact<{
  boardKey: Scalars["String"]["input"];
}>;

export type GetThreadsQuery = {
  __typename?: "Query";
  board?: {
    __typename?: "Board";
    id: string;
    threads: Array<{
      __typename?: "Thread";
      threadNumber: string;
      title: string;
      responseCount: number;
      lastModified: string;
      archived: number;
      active: number;
      authedCookie?: string | null;
      modulo: number;
    }>;
  } | null;
};

export type UpdateResponseMutationVariables = Exact<{
  res: ResInput;
}>;

export type UpdateResponseMutation = {
  __typename?: "Mutation";
  updateResponse: {
    __typename?: "Res";
    id: string;
    name?: string | null;
    mail?: string | null;
    body: string;
    threadId: string;
    boardId: number;
    isAbone: boolean;
  };
};

export const DeleteAuthedTokenDocument = {
  kind: "Document",
  definitions: [
    {
      kind: "OperationDefinition",
      operation: "mutation",
      name: { kind: "Name", value: "DeleteAuthedToken" },
      variableDefinitions: [
        {
          kind: "VariableDefinition",
          variable: {
            kind: "Variable",
            name: { kind: "Name", value: "token" },
          },
          type: {
            kind: "NonNullType",
            type: {
              kind: "NamedType",
              name: { kind: "Name", value: "String" },
            },
          },
        },
        {
          kind: "VariableDefinition",
          variable: {
            kind: "Variable",
            name: { kind: "Name", value: "usingOriginIp" },
          },
          type: {
            kind: "NonNullType",
            type: {
              kind: "NamedType",
              name: { kind: "Name", value: "Boolean" },
            },
          },
        },
      ],
      selectionSet: {
        kind: "SelectionSet",
        selections: [
          {
            kind: "Field",
            name: { kind: "Name", value: "deleteAuthedToken" },
            arguments: [
              {
                kind: "Argument",
                name: { kind: "Name", value: "token" },
                value: {
                  kind: "Variable",
                  name: { kind: "Name", value: "token" },
                },
              },
              {
                kind: "Argument",
                name: { kind: "Name", value: "usingOriginIp" },
                value: {
                  kind: "Variable",
                  name: { kind: "Name", value: "usingOriginIp" },
                },
              },
            ],
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<
  DeleteAuthedTokenMutation,
  DeleteAuthedTokenMutationVariables
>;
export const GetArchivedThreadDataDocument = {
  kind: "Document",
  definitions: [
    {
      kind: "OperationDefinition",
      operation: "query",
      name: { kind: "Name", value: "GetArchivedThreadData" },
      variableDefinitions: [
        {
          kind: "VariableDefinition",
          variable: {
            kind: "Variable",
            name: { kind: "Name", value: "boardKey" },
          },
          type: {
            kind: "NonNullType",
            type: {
              kind: "NamedType",
              name: { kind: "Name", value: "String" },
            },
          },
        },
        {
          kind: "VariableDefinition",
          variable: {
            kind: "Variable",
            name: { kind: "Name", value: "threadId" },
          },
          type: {
            kind: "NonNullType",
            type: {
              kind: "NamedType",
              name: { kind: "Name", value: "String" },
            },
          },
        },
      ],
      selectionSet: {
        kind: "SelectionSet",
        selections: [
          {
            kind: "Field",
            name: { kind: "Name", value: "board" },
            arguments: [
              {
                kind: "Argument",
                name: { kind: "Name", value: "boardKey" },
                value: {
                  kind: "Variable",
                  name: { kind: "Name", value: "boardKey" },
                },
              },
            ],
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                { kind: "Field", name: { kind: "Name", value: "id" } },
                {
                  kind: "Field",
                  name: { kind: "Name", value: "archivedThreads" },
                  arguments: [
                    {
                      kind: "Argument",
                      name: { kind: "Name", value: "threadId" },
                      value: {
                        kind: "Variable",
                        name: { kind: "Name", value: "threadId" },
                      },
                    },
                  ],
                  selectionSet: {
                    kind: "SelectionSet",
                    selections: [
                      {
                        kind: "Field",
                        name: { kind: "Name", value: "threadNumber" },
                      },
                      { kind: "Field", name: { kind: "Name", value: "title" } },
                      {
                        kind: "Field",
                        name: { kind: "Name", value: "responseCount" },
                      },
                      {
                        kind: "Field",
                        name: { kind: "Name", value: "lastModified" },
                      },
                      {
                        kind: "Field",
                        name: { kind: "Name", value: "boardId" },
                      },
                      {
                        kind: "Field",
                        name: { kind: "Name", value: "responses" },
                        selectionSet: {
                          kind: "SelectionSet",
                          selections: [
                            {
                              kind: "Field",
                              name: { kind: "Name", value: "name" },
                            },
                            {
                              kind: "Field",
                              name: { kind: "Name", value: "mail" },
                            },
                            {
                              kind: "Field",
                              name: { kind: "Name", value: "date" },
                            },
                            {
                              kind: "Field",
                              name: { kind: "Name", value: "authorId" },
                            },
                            {
                              kind: "Field",
                              name: { kind: "Name", value: "body" },
                            },
                            {
                              kind: "Field",
                              name: { kind: "Name", value: "isAbone" },
                            },
                            {
                              kind: "Field",
                              name: { kind: "Name", value: "ipAddr" },
                            },
                            {
                              kind: "Field",
                              name: { kind: "Name", value: "authedToken" },
                            },
                          ],
                        },
                      },
                    ],
                  },
                },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<
  GetArchivedThreadDataQuery,
  GetArchivedThreadDataQueryVariables
>;
export const GetArchivedThreadsDocument = {
  kind: "Document",
  definitions: [
    {
      kind: "OperationDefinition",
      operation: "query",
      name: { kind: "Name", value: "GetArchivedThreads" },
      variableDefinitions: [
        {
          kind: "VariableDefinition",
          variable: {
            kind: "Variable",
            name: { kind: "Name", value: "boardKey" },
          },
          type: {
            kind: "NonNullType",
            type: {
              kind: "NamedType",
              name: { kind: "Name", value: "String" },
            },
          },
        },
        {
          kind: "VariableDefinition",
          variable: { kind: "Variable", name: { kind: "Name", value: "page" } },
          type: {
            kind: "NonNullType",
            type: { kind: "NamedType", name: { kind: "Name", value: "Int" } },
          },
        },
      ],
      selectionSet: {
        kind: "SelectionSet",
        selections: [
          {
            kind: "Field",
            name: { kind: "Name", value: "board" },
            arguments: [
              {
                kind: "Argument",
                name: { kind: "Name", value: "boardKey" },
                value: {
                  kind: "Variable",
                  name: { kind: "Name", value: "boardKey" },
                },
              },
            ],
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                { kind: "Field", name: { kind: "Name", value: "id" } },
                {
                  kind: "Field",
                  name: { kind: "Name", value: "archivedThreads" },
                  arguments: [
                    {
                      kind: "Argument",
                      name: { kind: "Name", value: "page" },
                      value: {
                        kind: "Variable",
                        name: { kind: "Name", value: "page" },
                      },
                    },
                  ],
                  selectionSet: {
                    kind: "SelectionSet",
                    selections: [
                      {
                        kind: "Field",
                        name: { kind: "Name", value: "threadNumber" },
                      },
                      { kind: "Field", name: { kind: "Name", value: "title" } },
                      {
                        kind: "Field",
                        name: { kind: "Name", value: "responseCount" },
                      },
                      {
                        kind: "Field",
                        name: { kind: "Name", value: "lastModified" },
                      },
                      {
                        kind: "Field",
                        name: { kind: "Name", value: "boardId" },
                      },
                    ],
                  },
                },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<
  GetArchivedThreadsQuery,
  GetArchivedThreadsQueryVariables
>;
export const GetArchivedThreadsByQueryDocument = {
  kind: "Document",
  definitions: [
    {
      kind: "OperationDefinition",
      operation: "query",
      name: { kind: "Name", value: "GetArchivedThreadsByQuery" },
      variableDefinitions: [
        {
          kind: "VariableDefinition",
          variable: {
            kind: "Variable",
            name: { kind: "Name", value: "boardKey" },
          },
          type: {
            kind: "NonNullType",
            type: {
              kind: "NamedType",
              name: { kind: "Name", value: "String" },
            },
          },
        },
        {
          kind: "VariableDefinition",
          variable: { kind: "Variable", name: { kind: "Name", value: "page" } },
          type: {
            kind: "NonNullType",
            type: { kind: "NamedType", name: { kind: "Name", value: "Int" } },
          },
        },
        {
          kind: "VariableDefinition",
          variable: {
            kind: "Variable",
            name: { kind: "Name", value: "query" },
          },
          type: {
            kind: "NonNullType",
            type: {
              kind: "NamedType",
              name: { kind: "Name", value: "String" },
            },
          },
        },
      ],
      selectionSet: {
        kind: "SelectionSet",
        selections: [
          {
            kind: "Field",
            name: { kind: "Name", value: "board" },
            arguments: [
              {
                kind: "Argument",
                name: { kind: "Name", value: "boardKey" },
                value: {
                  kind: "Variable",
                  name: { kind: "Name", value: "boardKey" },
                },
              },
            ],
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                { kind: "Field", name: { kind: "Name", value: "id" } },
                {
                  kind: "Field",
                  name: { kind: "Name", value: "archivedThreads" },
                  arguments: [
                    {
                      kind: "Argument",
                      name: { kind: "Name", value: "page" },
                      value: {
                        kind: "Variable",
                        name: { kind: "Name", value: "page" },
                      },
                    },
                    {
                      kind: "Argument",
                      name: { kind: "Name", value: "query" },
                      value: {
                        kind: "Variable",
                        name: { kind: "Name", value: "query" },
                      },
                    },
                  ],
                  selectionSet: {
                    kind: "SelectionSet",
                    selections: [
                      {
                        kind: "Field",
                        name: { kind: "Name", value: "threadNumber" },
                      },
                      { kind: "Field", name: { kind: "Name", value: "title" } },
                      {
                        kind: "Field",
                        name: { kind: "Name", value: "responseCount" },
                      },
                      {
                        kind: "Field",
                        name: { kind: "Name", value: "lastModified" },
                      },
                      {
                        kind: "Field",
                        name: { kind: "Name", value: "boardId" },
                      },
                    ],
                  },
                },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<
  GetArchivedThreadsByQueryQuery,
  GetArchivedThreadsByQueryQueryVariables
>;
export const GetAuditLogsDocument = {
  kind: "Document",
  definitions: [
    {
      kind: "OperationDefinition",
      operation: "query",
      name: { kind: "Name", value: "GetAuditLogs" },
      selectionSet: {
        kind: "SelectionSet",
        selections: [
          {
            kind: "Field",
            name: { kind: "Name", value: "auditLogs" },
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                { kind: "Field", name: { kind: "Name", value: "id" } },
                { kind: "Field", name: { kind: "Name", value: "userEmail" } },
                {
                  kind: "Field",
                  name: { kind: "Name", value: "usedPermission" },
                },
                { kind: "Field", name: { kind: "Name", value: "info" } },
                { kind: "Field", name: { kind: "Name", value: "ipAddr" } },
                { kind: "Field", name: { kind: "Name", value: "timestamp" } },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<GetAuditLogsQuery, GetAuditLogsQueryVariables>;
export const GetBoardsDocument = {
  kind: "Document",
  definitions: [
    {
      kind: "OperationDefinition",
      operation: "query",
      name: { kind: "Name", value: "GetBoards" },
      selectionSet: {
        kind: "SelectionSet",
        selections: [
          {
            kind: "Field",
            name: { kind: "Name", value: "boards" },
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                { kind: "Field", name: { kind: "Name", value: "id" } },
                { kind: "Field", name: { kind: "Name", value: "name" } },
                { kind: "Field", name: { kind: "Name", value: "boardKey" } },
                { kind: "Field", name: { kind: "Name", value: "threadCount" } },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<GetBoardsQuery, GetBoardsQueryVariables>;
export const GetThreadDataDocument = {
  kind: "Document",
  definitions: [
    {
      kind: "OperationDefinition",
      operation: "query",
      name: { kind: "Name", value: "GetThreadData" },
      variableDefinitions: [
        {
          kind: "VariableDefinition",
          variable: {
            kind: "Variable",
            name: { kind: "Name", value: "boardKey" },
          },
          type: {
            kind: "NonNullType",
            type: {
              kind: "NamedType",
              name: { kind: "Name", value: "String" },
            },
          },
        },
        {
          kind: "VariableDefinition",
          variable: {
            kind: "Variable",
            name: { kind: "Name", value: "threadId" },
          },
          type: {
            kind: "NonNullType",
            type: {
              kind: "NamedType",
              name: { kind: "Name", value: "String" },
            },
          },
        },
      ],
      selectionSet: {
        kind: "SelectionSet",
        selections: [
          {
            kind: "Field",
            name: { kind: "Name", value: "board" },
            arguments: [
              {
                kind: "Argument",
                name: { kind: "Name", value: "boardKey" },
                value: {
                  kind: "Variable",
                  name: { kind: "Name", value: "boardKey" },
                },
              },
            ],
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                { kind: "Field", name: { kind: "Name", value: "id" } },
                {
                  kind: "Field",
                  name: { kind: "Name", value: "threads" },
                  arguments: [
                    {
                      kind: "Argument",
                      name: { kind: "Name", value: "threadNumber" },
                      value: {
                        kind: "Variable",
                        name: { kind: "Name", value: "threadId" },
                      },
                    },
                  ],
                  selectionSet: {
                    kind: "SelectionSet",
                    selections: [
                      {
                        kind: "Field",
                        name: { kind: "Name", value: "threadNumber" },
                      },
                      { kind: "Field", name: { kind: "Name", value: "title" } },
                      {
                        kind: "Field",
                        name: { kind: "Name", value: "responseCount" },
                      },
                      {
                        kind: "Field",
                        name: { kind: "Name", value: "lastModified" },
                      },
                      {
                        kind: "Field",
                        name: { kind: "Name", value: "archived" },
                      },
                      {
                        kind: "Field",
                        name: { kind: "Name", value: "active" },
                      },
                      {
                        kind: "Field",
                        name: { kind: "Name", value: "authedCookie" },
                      },
                      {
                        kind: "Field",
                        name: { kind: "Name", value: "modulo" },
                      },
                      {
                        kind: "Field",
                        name: { kind: "Name", value: "responses" },
                        selectionSet: {
                          kind: "SelectionSet",
                          selections: [
                            {
                              kind: "Field",
                              name: { kind: "Name", value: "id" },
                            },
                            {
                              kind: "Field",
                              name: { kind: "Name", value: "name" },
                            },
                            {
                              kind: "Field",
                              name: { kind: "Name", value: "mail" },
                            },
                            {
                              kind: "Field",
                              name: { kind: "Name", value: "date" },
                            },
                            {
                              kind: "Field",
                              name: { kind: "Name", value: "authorId" },
                            },
                            {
                              kind: "Field",
                              name: { kind: "Name", value: "body" },
                            },
                            {
                              kind: "Field",
                              name: { kind: "Name", value: "threadId" },
                            },
                            {
                              kind: "Field",
                              name: { kind: "Name", value: "ipAddr" },
                            },
                            {
                              kind: "Field",
                              name: { kind: "Name", value: "authedToken" },
                            },
                            {
                              kind: "Field",
                              name: { kind: "Name", value: "timestamp" },
                            },
                            {
                              kind: "Field",
                              name: { kind: "Name", value: "isAbone" },
                            },
                            {
                              kind: "Field",
                              name: { kind: "Name", value: "boardId" },
                            },
                          ],
                        },
                      },
                    ],
                  },
                },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<GetThreadDataQuery, GetThreadDataQueryVariables>;
export const GetThreadsDocument = {
  kind: "Document",
  definitions: [
    {
      kind: "OperationDefinition",
      operation: "query",
      name: { kind: "Name", value: "GetThreads" },
      variableDefinitions: [
        {
          kind: "VariableDefinition",
          variable: {
            kind: "Variable",
            name: { kind: "Name", value: "boardKey" },
          },
          type: {
            kind: "NonNullType",
            type: {
              kind: "NamedType",
              name: { kind: "Name", value: "String" },
            },
          },
        },
      ],
      selectionSet: {
        kind: "SelectionSet",
        selections: [
          {
            kind: "Field",
            name: { kind: "Name", value: "board" },
            arguments: [
              {
                kind: "Argument",
                name: { kind: "Name", value: "boardKey" },
                value: {
                  kind: "Variable",
                  name: { kind: "Name", value: "boardKey" },
                },
              },
            ],
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                { kind: "Field", name: { kind: "Name", value: "id" } },
                {
                  kind: "Field",
                  name: { kind: "Name", value: "threads" },
                  selectionSet: {
                    kind: "SelectionSet",
                    selections: [
                      {
                        kind: "Field",
                        name: { kind: "Name", value: "threadNumber" },
                      },
                      { kind: "Field", name: { kind: "Name", value: "title" } },
                      {
                        kind: "Field",
                        name: { kind: "Name", value: "responseCount" },
                      },
                      {
                        kind: "Field",
                        name: { kind: "Name", value: "lastModified" },
                      },
                      {
                        kind: "Field",
                        name: { kind: "Name", value: "archived" },
                      },
                      {
                        kind: "Field",
                        name: { kind: "Name", value: "active" },
                      },
                      {
                        kind: "Field",
                        name: { kind: "Name", value: "authedCookie" },
                      },
                      {
                        kind: "Field",
                        name: { kind: "Name", value: "modulo" },
                      },
                    ],
                  },
                },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<GetThreadsQuery, GetThreadsQueryVariables>;
export const UpdateResponseDocument = {
  kind: "Document",
  definitions: [
    {
      kind: "OperationDefinition",
      operation: "mutation",
      name: { kind: "Name", value: "UpdateResponse" },
      variableDefinitions: [
        {
          kind: "VariableDefinition",
          variable: { kind: "Variable", name: { kind: "Name", value: "res" } },
          type: {
            kind: "NonNullType",
            type: {
              kind: "NamedType",
              name: { kind: "Name", value: "ResInput" },
            },
          },
        },
      ],
      selectionSet: {
        kind: "SelectionSet",
        selections: [
          {
            kind: "Field",
            name: { kind: "Name", value: "updateResponse" },
            arguments: [
              {
                kind: "Argument",
                name: { kind: "Name", value: "res" },
                value: {
                  kind: "Variable",
                  name: { kind: "Name", value: "res" },
                },
              },
            ],
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                { kind: "Field", name: { kind: "Name", value: "id" } },
                { kind: "Field", name: { kind: "Name", value: "name" } },
                { kind: "Field", name: { kind: "Name", value: "mail" } },
                { kind: "Field", name: { kind: "Name", value: "body" } },
                { kind: "Field", name: { kind: "Name", value: "threadId" } },
                { kind: "Field", name: { kind: "Name", value: "boardId" } },
                { kind: "Field", name: { kind: "Name", value: "isAbone" } },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<
  UpdateResponseMutation,
  UpdateResponseMutationVariables
>;
