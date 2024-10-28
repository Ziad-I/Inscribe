import { IFile } from "@/types/definitions";

interface IFileEntry {
  [key: string]: IFile;
}

const entries: IFileEntry = {};

export const addFileEntry = (entry: IFile) => {
  entries[entry.id] = entry;
};

export const getFileEntry = (id: string): IFile => {
  return entries[id];
};

export const resetFileStore = (): void => {
  Object.keys(entries).forEach((key) => {
    delete entries[key];
  });
};
