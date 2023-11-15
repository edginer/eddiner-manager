"use client";

import BoardItem from "./BoardItem";
import useSWR from "swr";
import { Board } from "@/interfaces";

function Page() {
  const { data: boards } = useSWR<Board[]>("/api/boards");

  return (
    <div className="p-4">
      <h1 className="text-3xl font-bold">Boards</h1>
      <div className="grid grid-cols-1 p-1 pt-6 gap-4">
        {boards?.map((board) => (
          <BoardItem
            key={board.id}
            boardKey={board.board_key}
            boardName={board.name}
            threadCount={10}
          />
        ))}
      </div>
    </div>
  );
}

export default Page;
