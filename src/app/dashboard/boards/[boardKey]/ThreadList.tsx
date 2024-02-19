"use client";

import { Board } from "@/atoms";
import { Thread } from "@/gql/graphql";
import { DbArchivedThread, DbThread } from "@/interfaces";
import Link from "next/link";

interface ThreadListProps {
  threads: Pick<
    Thread,
    "threadNumber" | "title" | "responseCount" | "boardId" | "lastModified"
  >[];
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
        <div key={thread.threadNumber} className="flex items-center p-2">
          <input type="checkbox" className="mr-2" />
          <Link
            href={`/dashboard/boards/${board.boardKey}/${
              isArchives ? "archives" : "threads"
            }/${thread.threadNumber}`}
            className="text-blue-500 hover:underline cursor-pointer"
            prefetch={false}
          >
            <span className="flex-grow">{thread.title}</span>
          </Link>
          <span className="ml-auto mr-4">{thread.responseCount} responses</span>
        </div>
      ))}
    </div>
  );
};

export default ThreadList;
