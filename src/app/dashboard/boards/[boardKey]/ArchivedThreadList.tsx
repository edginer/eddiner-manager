import React, { useCallback, useState } from "react";
import ThreadList from "./ThreadList";
import { Label, Pagination, Select, TextInput } from "flowbite-react";
import { twMerge } from "tailwind-merge";
import { AiOutlineSearch } from "react-icons/ai";
import { useSuspenseQuery } from "@apollo/client";
import { gql } from "@/gql/gql";

const GET_ARCHIVED_THREADS_BY_QUERY =
  gql(`query GetArchivedThreadsByQuery($boardKey: String!, $page: Int!, $query: String!) {
  board(boardKey: $boardKey) {
    id
    archivedThreads(page: $page, query: $query) {
      threadNumber
      title
      responseCount
      lastModified
      boardId
    }
  }
}`);

interface Props {
  boardKey: string;
  boardName: string;
}

const ArchivedThreadList = ({ boardKey, boardName }: Props) => {
  const [selectedArchiveSearchKind, setSelectedArchiveSearchKind] = useState<
    "id" | "title"
  >("id");
  const [archiveSearchText, setArchiveSearchText] = useState<string>("");
  const [searchText, setSearchText] = useState("");
  const [archiveDatSearchValidationError, setArchiveDatSearchValidationError] =
    useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  const { data: archivedThreadsGql } = useSuspenseQuery(
    GET_ARCHIVED_THREADS_BY_QUERY,
    {
      variables: {
        boardKey,
        page: currentPage - 1,
        query: searchText,
      },
    },
  );

  const onPageChange = useCallback(
    (page: number) => {
      setCurrentPage(page);
    },
    [setCurrentPage],
  );

  return (
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
                e.target.value as "id" | "title",
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
            archiveDatSearchValidationError ? "Dat id must be 10 digits" : ""
          }
        />
        <button
          className={twMerge(
            "ml-2 w-10 h-10 rounded-md shadow-md focus-visible:ring-2 flex items-center justify-center",
            archiveDatSearchValidationError
              ? "bg-slate-300"
              : "bg-slate-400 hover:shadow-xl hover:bg-slate-700",
          )}
          disabled={
            archiveDatSearchValidationError || setArchiveSearchText.length === 0
          }
          onClick={() => {
            if (
              archiveDatSearchValidationError ||
              setArchiveSearchText.length === 0
            ) {
              return;
            }
            setSearchText(archiveSearchText);
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
        threads={
          archivedThreadsGql?.board?.archivedThreads?.map((x) => ({
            ...x,
            boardId: x.boardId,
          })) ?? []
        }
        board={{
          boardKey,
          boardName,
        }}
        archives
      />
    </div>
  );
};

export default ArchivedThreadList;
