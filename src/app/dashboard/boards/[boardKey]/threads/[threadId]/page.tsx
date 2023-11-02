"use client";

export const runtime = "edge";

import React, { useState, useEffect, useCallback, useRef } from "react";
import { Res, Thread } from "@/interfaces";
import ResponseList from "./ResponseList";
import Link from "next/link";
import Breadcrumb from "@/components/Breadcrumb";
import clsx from "clsx";

const Page = ({
  params,
}: {
  params: { boardKey: string; threadId: string };
}) => {
  const [threadData, setThreadData] = useState<Thread | undefined>();
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [responses, setResponses] = useState<Res[]>([]);
  const [selectedResponses, setSelectedResponses] = useState<Res[]>([]);
  const [showingFloatingDetail, setShowingFloatingDetail] = useState(false);

  const fetchThreadData = useCallback(async () => {
    try {
      const res = await fetch(
        `/api/boards/${params.boardKey}/threads/${params.threadId}`
      );
      const data = await res.json();
      return data;
    } catch (error) {
      throw new Error("Error fetching thread data");
    }
  }, [params.boardKey, params.threadId]);
  const updateResponse = useCallback(async (res: Res) => {
    try {
      const req = await fetch(`/api/responses/${res.id}`, {
        body: JSON.stringify(res),
        method: "PUT",
      });
      if (req.status !== 200) {
        throw new Error("Error updating response");
      }
    } catch (error) {
      return error;
    }
  }, []);
  const deleteAuthedCookie = useCallback(
    async (token: string, deleteAllSameOriginIp: boolean) => {
      try {
        const req = await fetch(
          `/api/authed-tokens/${token}?useOriginIp=${deleteAllSameOriginIp}`,
          {
            method: "DELETE",
          }
        );
        if (req.status !== 200) {
          throw new Error("Error deleting authed token");
        }
      } catch (error) {
        return error;
      }
    },
    []
  );

  useEffect(() => {
    fetchThreadData()
      .then((data) => {
        setThreadData(data.thread);
        setResponses(data.responses);
        setLoading(false);
      })
      .catch((error) => {
        setError(error.message);
        setLoading(false);
      });
  }, [fetchThreadData]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <>
      <div className="p-4">
        <h1 className="text-3xl font-bold">
          Thread: {threadData?.title} ({threadData?.thread_number})
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
        <ResponseList
          onClickAbon={async (responseId) => {
            const res = responses.find((res) => res.id === responseId);
            if (res) {
              res.is_abone = 1;
              await updateResponse(res);
            }
          }}
          onClickDeleteAuthedToken={async (token) => {
            await deleteAuthedCookie(token, false);
          }}
          onClickDeleteAuthedTokensAssociatedWithIp={async (token) => {
            await deleteAuthedCookie(token, true);
          }}
          {...{ responses, selectedResponses, setSelectedResponses }}
        />
      </div>
      <div className="fixed bottom-8 right-8 z-10">
        <div className={clsx(showingFloatingDetail ? "block" : "hidden")}>
          <button>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M3 6h18M6 6v-.01M9 6v-.01M12 6v-.01M15 6v-.01M18 6v-.01M6 6a2 2 0 012-2h8a2 2 0 012 2v.01M16 10v6a2 2 0 01-2 2H10a2 2 0 01-2-2v-6M14 3v-.01M10 3v-.01" />
            </svg>
          </button>
          <button>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="feather feather-trash-2"
            >
              <path d="M3 6h18M16 10v6a2 2 0 01-2 2H10a2 2 0 01-2-2v-6M5 6h14l-1.5 12A2 2 0 0115.5 20h-7a2 2 0 01-1.96-1.56L5 6z"></path>
              <rect x="15" y="15" width="6" height="6" rx="1"></rect>
              <text
                x="19"
                y="20"
                fontSize="10"
                textAnchor="middle"
                fill="currentColor"
              >
                ALL
              </text>
              <rect
                x="17"
                y="18"
                width="16"
                height="10"
                rx="2"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
              ></rect>
            </svg>
          </button>
        </div>
        <button
          className="rounded-full shadow-xl border-2 bg-blue-500 hover:bg-blue-700 w-14 h-14 items-center flex justify-center"
          onClick={() => setShowingFloatingDetail(!showingFloatingDetail)}
        >
          {showingFloatingDetail ? (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 text-white"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              width="24"
              height="24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 text-white"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              width="24"
              height="24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16m-7 6h7"
              />
            </svg>
          )}
        </button>
      </div>
    </>
  );
};

export default Page;
