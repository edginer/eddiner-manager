"use client";

export const runtime = "edge";

import React, { useState, useCallback } from "react";
import ResponseList from "./ResponseList";
import Link from "next/link";
import Breadcrumb from "@/components/Breadcrumb";
import clsx from "clsx";
import { Button, Modal } from "flowbite-react";
import { toast } from "react-toastify";
import { Res } from "@/gql/graphql";
import { gql } from "@/gql/gql";
import { useMutation, useSuspenseQuery } from "@apollo/client";

const GET_THREAD_DATA =
  gql(`query GetThreadData($boardKey: String!, $threadId: String!) {
  board(boardKey: $boardKey) {
    id
    threads(threadNumber: $threadId) {
      threadNumber
      title
      responseCount
      lastModified
      archived
      active
      authedCookie
      modulo
      responses {
        id
        name
        mail
        date
        authorId
        body
        threadId
        ipAddr
        authedToken
        timestamp
        isAbone
        boardId
      }
    }
  }
}`);

const DELETE_AUTHED_TOKEN =
  gql(`mutation DeleteAuthedToken($token: String!, $usingOriginIp: Boolean!) {
  deleteAuthedToken(token: $token, usingOriginIp: $usingOriginIp)
}`);

const UPDATE_RESPONSE = gql(`mutation UpdateResponse($res: ResInput!) {
  updateResponse(res: $res) {
    id
    name
    mail
    body
    threadId
    boardId
    isAbone
  }
}`);

const Page = ({
  params,
}: {
  params: { boardKey: string; threadId: string };
}) => {
  const [selectedEditingRes, setSelectedEditingRes] = useState<Res | undefined>(
    undefined
  );
  const [selectedResponses, setSelectedResponses] = useState<Res[]>([]);
  const [showingFloatingDetail, setShowingFloatingDetail] = useState(false);

  const { data: threadDataGql, refetch } = useSuspenseQuery(GET_THREAD_DATA, {
    variables: {
      boardKey: params.boardKey,
      threadId: params.threadId,
    },
  });
  const [updateRespMut] = useMutation(UPDATE_RESPONSE);
  const [deleteAuthedCookieMut] = useMutation(DELETE_AUTHED_TOKEN);

  const updateResponse = useCallback(
    async (res: Res) => {
      try {
        const _result = await updateRespMut({
          variables: {
            res,
          },
        });
        toast.success(`Successfully updated response`);
        await refetch();
      } catch (error) {
        toast.error(`Failed to update response`);
        return error;
      }
    },
    [refetch, updateRespMut]
  );
  const deleteAuthedCookie = useCallback(
    async (token: string, deleteAllSameOriginIp: boolean) => {
      try {
        await deleteAuthedCookieMut({
          variables: {
            token,
            usingOriginIp: deleteAllSameOriginIp,
          },
        });

        toast.success(`Successfully deleted authed token`);
      } catch (error) {
        toast.error(`Failed to delete authed token`);
        return error;
      }
    },
    [deleteAuthedCookieMut]
  );

  console.log("rendering: initializations done");

  return (
    <>
      <Modal
        show={selectedEditingRes != null}
        onClose={() => setSelectedEditingRes(undefined)}
      >
        <Modal.Header>Edit Response</Modal.Header>
        <Modal.Body>
          <div className="flex flex-row">
            <div className="flex flex-col">
              <label htmlFor="name">Name</label>
              <input
                type="text"
                id="name"
                className="border border-gray-300 rounded-md px-2 py-1"
                value={selectedEditingRes?.name ?? ""}
                onChange={(e) => {
                  if (selectedEditingRes) {
                    setSelectedEditingRes({
                      ...selectedEditingRes,
                      name: e.target.value,
                    });
                  }
                }}
              />
            </div>
            <div className="flex flex-col">
              <label htmlFor="mail">Mail</label>
              <input
                type="text"
                id="mail"
                className="border border-gray-300 rounded-md px-2 py-1"
                value={selectedEditingRes?.mail ?? ""}
                onChange={(e) => {
                  if (selectedEditingRes) {
                    setSelectedEditingRes({
                      ...selectedEditingRes,
                      mail: e.target.value,
                    });
                  }
                }}
              />
            </div>
          </div>

          <div className="flex flex-col">
            <label htmlFor="body">Body</label>
            <textarea
              id="body"
              className="border border-gray-300 rounded-md px-2 py-1"
              value={selectedEditingRes?.body}
              onChange={(e) => {
                if (selectedEditingRes) {
                  setSelectedEditingRes({
                    ...selectedEditingRes,
                    body: e.target.value,
                  });
                }
              }}
            />
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button
            onClick={() => {
              setSelectedEditingRes(undefined);
            }}
          >
            Close
          </Button>
          <Button
            onClick={() => {
              updateResponse(selectedEditingRes!!);
              setSelectedEditingRes(undefined);
            }}
          >
            Save
          </Button>
        </Modal.Footer>
      </Modal>
      <div className="p-4">
        <h1 className="text-3xl font-bold">
          Thread: {threadDataGql?.board?.threads[0].title} (
          {threadDataGql?.board?.threads[0].threadNumber})
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
            {threadDataGql?.board?.threads[0].title}
          </span>
        </Breadcrumb>
        <ResponseList
          onClickAbon={async (responseId) => {
            const res = threadDataGql?.board?.threads[0].responses.find(
              (res) => Number(res.id) === responseId
            );
            toast.error("Not implemented");
            if (res) {
              res.isAbone = true;
              await updateResponse(res);
            }
          }}
          onClickDeleteAuthedToken={async (token) => {
            await deleteAuthedCookie(token, false);
          }}
          onClickDeleteAuthedTokensAssociatedWithIp={async (token) => {
            await deleteAuthedCookie(token, true);
          }}
          onClickEditResponse={(response) => {
            // TODO: Implement
            // toast.error("Not implemented");
            setSelectedEditingRes(response);
          }}
          responses={
            threadDataGql?.board?.threads[0].responses.filter(
              (r) => r != null
            ) ?? []
          }
          {...{ selectedResponses, setSelectedResponses }}
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
