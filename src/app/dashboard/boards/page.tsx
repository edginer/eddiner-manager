"use client";

import { useState, useEffect } from "react";
import BoardItem from "./BoardItem";

interface Board {
  key: string;
  name: string;
  threadCount: number;
}

function Page() {
  const [boards, setBoards] = useState<Board[]>([]);

  useEffect(() => {
    // Fetch the list of boards from the server
    setBoards([
      {
        key: "liveedge",
        name: "Liveエッヂ",
        threadCount: 10,
      },
    ]);
  }, []);

  return (
    <div className="p-4">
      <h1 className="text-3xl font-bold">Boards</h1>
      <div className="grid grid-cols-1 p-1 pt-6 gap-4">
        {boards.map((board) => (
          <BoardItem
            key={board.key}
            boardKey={board.key}
            boardName={board.name}
            threadCount={board.threadCount}
          />
        ))}
      </div>
    </div>
  );
}

export default Page;
