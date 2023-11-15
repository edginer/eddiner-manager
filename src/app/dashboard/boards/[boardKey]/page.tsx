"use client";

import React, { useCallback, useEffect, useState } from "react";
import ThreadList from "./ThreadList";
import Link from "next/link";
import { ArchivedThread, Thread } from "@/interfaces";
import Breadcrumb from "@/components/Breadcrumb";
import { Label, Pagination, Select, TextInput } from "flowbite-react";
import { AiOutlineSearch } from "react-icons/ai";
import { twJoin, twMerge } from "tailwind-merge";

export const runtime = "edge";

const Page = ({ params }: { params: { boardKey: string } }) => {
  const [threads, setThreads] = useState<Thread[]>([]);
  const [archivedThreads, setArchivedThreads] = useState<
    ArchivedThread[] | undefined
  >(undefined);
  const [selectedTabKey, setSelectedTabKey] = useState<
    "threads" | "archivedThreads" | "settings"
  >("threads");
  const selectedTabClassNames = "border-blue-600";
  const unselectedTabClassNames =
    "hover:text-gray-600 hover:border-gray-300 dark:hover:text-gray-300";
  const [selectedArchiveSearchKind, setSelectedArchiveSearchKind] = useState<
    "id" | "title"
  >("id");
  const [archiveSearchText, setArchiveSearchText] = useState<string>("");
  const [archiveDatSearchValidationError, setArchiveDatSearchValidationError] =
    useState(false);
  const [searched, setSearched] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  const fetchThreads = useCallback(async () => {
    try {
      let boardId = 1;
      if (params.boardKey === "liveedge") {
        boardId = 1;
      }
      const res = await fetch(`/api/boards/${boardId}/threads`);
      const data: Thread[] = await res.json();
      return data;
    } catch (error) {
      throw new Error("Error fetching thread data");
    }
  }, [params.boardKey]);

  const fetchArchivedThreads = useCallback(
    async (page: number = 0) => {
      try {
        let boardId = 1;
        if (params.boardKey === "liveedge") {
          boardId = 1;
        }
        const res = await fetch(`/api/boards/${boardId}/archives?page=${page}`);
        const data: ArchivedThread[] = await res.json();
        return data;
      } catch (error) {
        throw new Error("Error fetching thread data");
      }
    },
    [params.boardKey]
  );

  const searchArchivedThreads = useCallback(
    async (page: number = 0) => {
      try {
        let boardId = 1;
        if (params.boardKey === "liveedge") {
          boardId = 1;
        }
        if (selectedArchiveSearchKind === "id") {
          const res = await fetch(
            `/api/boards/${boardId}/archives/${archiveSearchText}?head=true`
          );
          const data: ArchivedThread = await res.json();
          return [data];
        } else {
          const res = await fetch(
            `/api/boards/${boardId}/archives?query=${archiveSearchText}&page=${page}`
          );
          const data: ArchivedThread[] = await res.json();
          return data;
        }
      } catch (error) {
        throw new Error("Error fetching thread data");
      } finally {
        setSearched(true);
      }
    },
    [params.boardKey, selectedArchiveSearchKind, archiveSearchText]
  );

  const onPageChange = useCallback(
    (page: number) => {
      setCurrentPage(page);
      if (searched) {
        searchArchivedThreads(page - 1)
          .then((data) => {
            setArchivedThreads(data);
          })
          .catch((error) => {
            throw new Error(error.message);
          });
      } else {
        fetchArchivedThreads(page - 1)
          .then((data) => {
            setArchivedThreads(data);
          })
          .catch((error) => {
            throw new Error(error.message);
          });
      }
    },
    [fetchArchivedThreads, searchArchivedThreads, searched]
  );

  useEffect(() => {
    fetchThreads()
      .then((data) => {
        setThreads(data);
      })
      .catch((error) => {
        throw new Error(error.message);
      });
  }, [fetchThreads]);
  useEffect(() => {
    if (selectedTabKey === "archivedThreads" && archivedThreads == null) {
      fetchArchivedThreads()
        .then((data) => {
          setArchivedThreads(data);
        })
        .catch((error) => {
          throw new Error(error.message);
        });
    }
  }, [fetchArchivedThreads, selectedTabKey, archivedThreads]);

  return (
    <div className="p-4">
      <h1 className="text-3xl font-bold">Threads: {params.boardKey}</h1>
      <Breadcrumb>
        <Link
          href="/dashboard/boards"
          className="text-gray-500 hover:text-gray-700"
        >
          Boards
        </Link>
        <span className="text-gray-500" aria-current="page">
          Threads: {params.boardKey}
        </span>
      </Breadcrumb>
      <div className="px-4 pt-4">
        <div className="mb-4 border-b border-gray-200 dark:border-gray-700">
          <ul
            className="flex flex-wrap -mb-px text-sm font-medium text-center"
            id="default-tab"
            role="tablist"
          >
            <li className="mr-2" role="presentation">
              <button
                className={twJoin(
                  "inline-block p-4 border-b-2 rounded-t-lg",
                  selectedTabKey === "threads"
                    ? selectedTabClassNames
                    : unselectedTabClassNames
                )}
                id="profile-tab"
                type="button"
                role="tab"
                aria-controls="profile"
                aria-selected="false"
                onClick={() => setSelectedTabKey("threads")}
              >
                Threads
              </button>
            </li>
            <li className="mr-2" role="presentation">
              <button
                className={twJoin(
                  "inline-block p-4 border-b-2 rounded-t-lg",
                  selectedTabKey === "archivedThreads"
                    ? selectedTabClassNames
                    : unselectedTabClassNames
                )}
                id="dashboard-tab"
                type="button"
                role="tab"
                aria-controls="dashboard"
                aria-selected="false"
                onClick={() => setSelectedTabKey("archivedThreads")}
              >
                Archived Threads
              </button>
            </li>
            <li className="mr-2" role="presentation">
              <button
                className={twJoin(
                  "inline-block p-4 border-b-2 rounded-t-lg",
                  selectedTabKey === "settings"
                    ? selectedTabClassNames
                    : unselectedTabClassNames
                )}
                id="settings-tab"
                type="button"
                role="tab"
                aria-controls="settings"
                aria-selected="false"
                onClick={() => setSelectedTabKey("settings")}
              >
                Settings
              </button>
            </li>
          </ul>
        </div>
        {selectedTabKey === "threads" && (
          <div className="p-2">
            <ThreadList
              threads={threads}
              board={{
                boardKey: params.boardKey,
                boardName: "Liveエッヂ",
              }}
            />
          </div>
        )}
        {selectedTabKey === "archivedThreads" && (
          <div className="p-2">
            <div className="flex flex-row pb-5 items-end">
              <div className="max-w-md mr-2">
                <div className="mb-1 block">
                  <Label htmlFor="searchKind" value="Search kind" />
                </div>
                <Select
                  id="searchKind"
                  className="w-24"
                  required
                  onChange={(e) =>
                    setSelectedArchiveSearchKind(
                      // SAFETY: e.target.value is always either "id" or "title" because of the <option> elements
                      e.target.value as "id" | "title"
                    )
                  }
                >
                  <option value="id">Dat Id</option>
                  <option value="title">Title</option>
                </Select>
              </div>
              <TextInput
                id="archives-serach"
                type="search"
                required
                shadow
                placeholder={
                  selectedArchiveSearchKind === "id"
                    ? "10-digit dat id"
                    : "Thread title"
                }
                color={archiveDatSearchValidationError ? "failure" : "gray"}
                onChange={(e) => {
                  setArchiveSearchText(e.target.value);
                  if (
                    selectedArchiveSearchKind === "id" &&
                    archiveSearchText.length !== 10 &&
                    !isNaN(parseInt(archiveSearchText))
                  ) {
                    setArchiveDatSearchValidationError(true);
                  } else {
                    setArchiveDatSearchValidationError(false);
                  }
                }}
                onBlur={() => {}}
                helperText={
                  archiveDatSearchValidationError
                    ? "Dat id must be 10 digits"
                    : ""
                }
              />
              <button
                className={twMerge(
                  "ml-2 w-10 h-10 rounded-md shadow-md focus-visible:ring-2 flex items-center justify-center",
                  archiveDatSearchValidationError
                    ? "bg-slate-300"
                    : "bg-slate-400 hover:shadow-xl hover:bg-slate-700"
                )}
                disabled={
                  archiveDatSearchValidationError ||
                  setArchiveSearchText.length === 0
                }
                onClick={() => {
                  searchArchivedThreads()
                    .then((data) => {
                      setArchivedThreads(data);
                    })
                    .catch((error) => {
                      throw new Error(error.message);
                    });
                }}
              >
                <AiOutlineSearch />
              </button>
              <div className="flex overflow-x-auto sm:justify-center flex-grow">
                <Pagination
                  layout="navigation"
                  currentPage={currentPage}
                  totalPages={100}
                  onPageChange={onPageChange}
                />
              </div>
            </div>
            <ThreadList
              threads={archivedThreads ?? []}
              board={{
                boardKey: params.boardKey,
                boardName: "Liveエッヂ",
              }}
              archives
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default Page;
