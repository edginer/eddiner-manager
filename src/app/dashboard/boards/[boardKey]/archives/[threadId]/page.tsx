"use client";

export const runtime = "edge";

import { ThreadResResp } from "@/interfaces";
import ResponseList from "./ResponseList";
import Breadcrumb from "@/components/Breadcrumb";
import Link from "next/link";
import useSWR from "swr";

const Page = ({
  params,
}: {
  params: { boardKey: string; threadId: string };
}) => {
  const { data: threadData } = useSWR<ThreadResResp>(
    `/api/boards/${params.boardKey}/archives/${params.threadId}`
  );

  return (
    <>
      <div className="p-4">
        <h1 className="text-3xl font-bold">
          Archived Thread: {threadData?.thread?.title} (
          {threadData?.thread?.thread_number})
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
            {threadData?.thread.title}
          </span>
        </Breadcrumb>
        <ResponseList responses={threadData?.responses!!} />
      </div>
    </>
  );
};

export default Page;
