import React, { useCallback, useState } from "react";
import ThreadList from "./ThreadList";
import { Label, Pagination, Select, TextInput } from "flowbite-react";
import { twMerge } from "tailwind-merge";
import { ArchivedThread } from "@/interfaces";
import useSWR from "swr";
import { AiOutlineSearch } from "react-icons/ai";

interface Props {
  boardId: number;
  boardKey: string;
  boardName: string;
  active: boolean;
}

const ArchivedThreadList = ({
  boardId,
  boardKey,
  boardName,
  active,
}: Props) => {
  const [selectedArchiveSearchKind, setSelectedArchiveSearchKind] = useState<
    "id" | "title"
  >("id");
  const [archiveSearchText, setArchiveSearchText] = useState<string>("");
  const [archiveDatSearchValidationError, setArchiveDatSearchValidationError] =
    useState(false);
  const [searched, setSearched] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  const { data: archivedThreads, mutate: mutateArchivedThreads } = useSWR<
    ArchivedThread[]
  >(active ? `/api/boards/${boardId}/archives?page=${currentPage}` : null);

  const searchArchivedThreads = useCallback(
    async (page: number = 0) => {
      try {
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
    [selectedArchiveSearchKind, archiveSearchText, boardId]
  );

  const onPageChange = useCallback(
    (page: number) => {
      setCurrentPage(page);
      if (searched) {
        searchArchivedThreads(page - 1)
          .then((data) => {
            mutateArchivedThreads(data, false);
          })
          .catch((error) => {
            throw new Error(error.message);
          });
      }
    },
    [searchArchivedThreads, searched, mutateArchivedThreads]
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
            archiveDatSearchValidationError ? "Dat id must be 10 digits" : ""
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
            archiveDatSearchValidationError || setArchiveSearchText.length === 0
          }
          onClick={() => {
            searchArchivedThreads()
              .then((data) => {
                mutateArchivedThreads(data, false);
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
          boardKey,
          boardName,
        }}
        archives
      />
    </div>
  );
};

export default ArchivedThreadList;
