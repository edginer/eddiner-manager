"use client";

export const runtime = "edge";

import ResponseList from "./ResponseList";
import Breadcrumb from "@/components/Breadcrumb";
import Link from "next/link";
import { useSuspenseQuery } from "@apollo/client";
import { gql } from "@/gql/gql";

const GET_ARCHIVED_THREAD =
  gql(`query GetArchivedThreadData($boardKey: String!, $threadId: String!) {
  board(boardKey: $boardKey) {
    id
    archivedThreads(threadId: $threadId) {
      threadNumber
      title
      responseCount
      lastModified
      boardId
      responses {
        name
        mail
        date
        authorId
        body
        isAbone
        ipAddr
        authedToken
      }
    }
  }
}`);

const Page = ({
  params,
}: {
  params: { boardKey: string; threadId: string };
}) => {
  const { data } = useSuspenseQuery(GET_ARCHIVED_THREAD, {
    variables: {
      boardKey: params.boardKey,
      threadId: params.threadId,
    },
  });
  const title = data?.board?.archivedThreads[0].title;
  const threadNumber = data?.board?.archivedThreads[0].threadNumber;
  const responses = data?.board?.archivedThreads[0].responses;

  return (
    <>
      <div className="p-4">
        <h1 className="text-3xl font-bold">
          Archived Thread: {title} ({threadNumber})
        </h1>
        <Breadcrumb>
          <Link
            href="/dashboard/boards"
            className="text-gray-500 hover:text-gray-700"
          >
            Boards
          </Link>
          <Link
            href={`/dashboard/boards/${params.boardKey}`}
            className="text-gray-500 hover:text-gray-700"
          >
            {params.boardKey}
          </Link>
          <span className="text-gray-500" aria-current="page">
            {title}
          </span>
        </Breadcrumb>
        <ResponseList responses={responses!!} />
      </div>
    </>
  );
};

export default Page;
