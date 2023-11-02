import { atom } from "recoil";

export interface Board {
  boardKey: string;
  boardName: string;
}

export interface Thread {
  threadKey: string;
  threadName: string;
}

export const selectedBoardState = atom<Board | undefined>({
  key: "selectedBoard",
  default: undefined,
});

export const selectedThreadState = atom<Thread | undefined>({
  key: "selectedThread",
  default: undefined,
});
