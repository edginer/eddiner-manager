"use client";

import { Board } from "@/atoms";
import { ArchivedThread, Thread } from "@/interfaces";
import Link from "next/link";

interface ThreadListProps {
  threads: ArchivedThread[];
  board: Board;
  archives?: boolean;
}

const ThreadList: React.FC<ThreadListProps> = ({
  threads,
  board,
  archives: isArchives,
}) => {
  return (
    <div className="rounded border border-black divide-y divide-black">
      {threads.map((thread) => (
        <div key={thread.thread_number} className="flex items-center p-2">
          <input type="checkbox" className="mr-2" />
          <Link
            href={`/dashboard/boards/${board.boardKey}/${
              isArchives ? "archives" : "threads"
            }/${thread.thread_number}`}
            className="text-blue-500 hover:underline cursor-pointer"
          >
            <span className="flex-grow">{thread.title}</span>
          </Link>
          <span className="ml-auto mr-4">
            {thread.response_count} responses
          </span>
        </div>
      ))}
    </div>
  );
};

export default ThreadList;
