"use client";

export const runtime = "edge";

import { Res, Thread } from "@/interfaces";
import { useCallback, useEffect, useState } from "react";
import ResponseList from "./ResponseList";
import Breadcrumb from "@/components/Breadcrumb";
import Link from "next/link";

const Page = ({
  params,
}: {
  params: { boardKey: string; threadId: string };
}) => {
  const [threadData, setThreadData] = useState<Thread | undefined>();
  const [responses, setResponses] = useState<Res[]>([]);

  const fetchThreadData = useCallback(async () => {
    try {
      const res = await fetch(
        `/api/boards/${params.boardKey}/archives/${params.threadId}`
      );
      const data = await res.json();
      return data;
    } catch (error) {
      throw new Error("Error fetching thread data");
    }
  }, [params.boardKey, params.threadId]);

  useEffect(() => {
    fetchThreadData()
      .then((data) => {
        setThreadData(data.thread);
        setResponses(data.responses);
      })
      .catch((error) => {
        throw new Error(error.message);
      });
  }, [fetchThreadData]);

  return (
    <>
      <div className="p-4">
        <h1 className="text-3xl font-bold">
          Archived Thread: {threadData?.title} ({threadData?.thread_number})
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
            {threadData?.title}
          </span>
        </Breadcrumb>
        <ResponseList {...{ responses }} />
      </div>
    </>
  );
};

export default Page;
