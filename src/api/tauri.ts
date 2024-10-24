import { invoke } from "@tauri-apps/api/core";
import { nanoid } from "nanoid";
import { IFile } from "@/types/definitions";

// Function to read a directory with error handling
export const readDirectory = async (dirPath: string): Promise<IFile[]> => {
  try {
    const fileInfoList = await invoke<IFile[]>("read_directory", { dirPath });

    return fileInfoList.map((fileInfo) => ({
      id: nanoid(),
      name: fileInfo.name,
      kind: fileInfo.kind === "directory" ? "directory" : "file",
      path: fileInfo.path,
    }));
  } catch (error) {
    console.error(`Failed to read directory at ${dirPath}:`, error);
    throw new Error(`Unable to read directory: ${dirPath}`);
  }
};

// Function to create a directory with error handling
export const createDirectory = async (path: string): Promise<void> => {
  try {
    await invoke<void>("create_directory", { path });
  } catch (error) {
    console.error(`Failed to create directory at ${path}:`, error);
    throw new Error(`Unable to create directory: ${path}`);
  }
};

// Function to remove a directory with error handling
export const removeFolder = async (path: string): Promise<void> => {
  try {
    await invoke<void>("remove_directory", { path });
  } catch (error) {
    console.error(`Failed to remove directory at ${path}:`, error);
    throw new Error(`Unable to remove directory: ${path}`);
  }
};

// Function to read a file with error handling
export const readFile = async (path: string): Promise<string> => {
  try {
    return await invoke<string>("read_file", { path });
  } catch (error) {
    console.error(`Failed to read file at ${path}:`, error);
    throw new Error(`Unable to read file: ${path}`);
  }
};

// Function to write to a file with error handling
export const writeFile = async (
  path: string,
  content: string
): Promise<void> => {
  try {
    await invoke<void>("write_file", { path, content });
  } catch (error) {
    console.error(`Failed to write to file at ${path}:`, error);
    throw new Error(`Unable to write to file: ${path}`);
  }
};

// Function to remove a file with error handling
export const removeFile = async (path: string): Promise<void> => {
  try {
    await invoke<void>("remove_file", { path });
  } catch (error) {
    console.error(`Failed to remove file at ${path}:`, error);
    throw new Error(`Unable to remove file: ${path}`);
  }
};
