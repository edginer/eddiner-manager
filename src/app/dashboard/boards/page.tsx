"use client";

import BoardItem from "./BoardItem";
import { useQuery } from "@apollo/client";
import { gql } from "@/gql";

const GET_BOARDS_QUERY = gql(`query GetBoards {
  boards {
    id
    name
    boardKey
    threadCount
  }
}`);

function Page() {
  const { data: boards } = useQuery(GET_BOARDS_QUERY);

  return (
    <div className="p-4">
      <h1 className="text-3xl font-bold">Boards</h1>
      <div className="grid grid-cols-1 p-1 pt-6 gap-4">
        {boards?.boards.map((board) => (
          <BoardItem
            key={board.id}
            boardKey={board.boardKey}
            boardName={board.name}
            threadCount={board.threadCount}
          />
        ))}
      </div>
    </div>
  );
}

export default Page;
