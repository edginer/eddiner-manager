"use client";

import React, { useCallback, useMemo, useState } from "react";
import ThreadList from "./ThreadList";
import Link from "next/link";
import Breadcrumb from "@/components/Breadcrumb";
import Tab from "@/components/Tab";
import ArchivedThreadList from "./ArchivedThreadList";
import { useSuspenseQuery } from "@apollo/client";
import { gql } from "@/gql";
import { Board } from "@/gql/graphql";

export const runtime = "edge";

const GET_BOARDS = gql(`query GetBoards {
  boards {
    id
    name
    boardKey
    threadCount
  }
}`);

const GET_THREADS = gql(`query GetThreads($boardKey: String!) {
  board(boardKey: $boardKey) {
    id
    threads {
      threadNumber
      title
      responseCount
      lastModified
      archived
      active
      authedCookie
      modulo
    }
  }
}`);

type TabKeys = "threads" | "archivedThreads" | "settings";

const getBoard = (
  boards: Omit<Board, "threads" | "archivedThreads">[] | undefined,
  boardKey: string
) => {
  if (boards == null) {
    throw new Error("Boards is undefined or null");
  }

  const board = boards.find((board) => board.boardKey === boardKey);
  if (board == null) {
    throw new Error("Specified board not found (from searching board key)");
  }
  return board;
};

const Page = ({ params }: { params: { boardKey: string } }) => {
  const { data: boards } = useSuspenseQuery(GET_BOARDS);

  const currentBoard = useMemo(
    () => getBoard(boards.boards, params.boardKey),
    [boards, params.boardKey]
  );

  const { data: threads } = useSuspenseQuery(GET_THREADS, {
    variables: {
      boardKey: params.boardKey,
    },
  });

  const [selectedTabKey, setSelectedTabKey] = useState<TabKeys>("threads");

  const onSelectedTabChange = useCallback(
    (tabKey: TabKeys) => {
      setSelectedTabKey(tabKey);
    },
    [setSelectedTabKey]
  );

  return (
    <div className="p-4">
      <h1 className="text-3xl font-bold">Threads: {params.boardKey}</h1>
      <Breadcrumb>
        <Link
          href="/dashboard/boards"
          className="text-gray-500 hover:text-gray-700"
        >
          Boards
        </Link>
        <span className="text-gray-500" aria-current="page">
          Threads: {currentBoard.name} ({params.boardKey})
        </span>
      </Breadcrumb>
      <Tab
        onSelectedTabChange={onSelectedTabChange}
        tabItems={[
          {
            tabKey: "threads",
            tabLabel: "Threads",
            id: "threads-tab",
            children: (
              <div className="p-2">
                <ThreadList
                  threads={
                    threads.board?.threads.map((x) => ({
                      ...x,
                      boardId: Number(currentBoard.id),
                    })) ?? []
                  }
                  board={{
                    boardKey: params.boardKey,
                    boardName: currentBoard.name,
                  }}
                />
              </div>
            ),
          },
          {
            tabKey: "archivedThreads",
            tabLabel: "Archived Threads",
            id: "archived-threads-tab",
            children: (
              <div className="p-2">
                <ArchivedThreadList
                  boardId={Number(currentBoard.id)}
                  boardKey={params.boardKey}
                  boardName={currentBoard.name}
                  active={selectedTabKey === "archivedThreads"}
                />
              </div>
            ),
          },
          {
            tabKey: "settings",
            tabLabel: "Settings",
            id: "settings-tab",
            children: <div className="p-2">Settings</div>,
          },
        ]}
      />
    </div>
  );
};

export default Page;
