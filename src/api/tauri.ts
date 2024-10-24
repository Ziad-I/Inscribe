import { invoke } from "@tauri-apps/api/core";
import { nanoid } from "nanoid";
import { IFile } from "@/types/definitions";

type FileInfo = {
  name: string;
  kind: "file" | "directory";
  path: string;
};

type TauriError = {
  kind: "io" | "utf8" | "invalidPath" | "permissionDenied";
  message: string;
};

// Helper function to handle Tauri errors
const handleTauriError = (error: unknown, context: string): never => {
  const tauriError = error as TauriError;
  let message = `Unable to ${context}`;

  if (tauriError.kind) {
    switch (tauriError.kind) {
      case "invalidPath":
        message = `Invalid path: ${tauriError.message}`;
        break;
      case "permissionDenied":
        message = `Permission denied: ${tauriError.message}`;
        break;
      case "io":
        message = `I/O error: ${tauriError.message}`;
        break;
      case "utf8":
        message = `Text encoding error: ${tauriError.message}`;
        break;
    }
  }

  console.error(`${context} failed:`, error);
  throw new Error(message);
};

// Function to read a directory with error handling
export async function readDirectory(dirPath: string): Promise<IFile[]> {
  try {
    const fileInfoList = await invoke<FileInfo[]>("read_directory", {
      path: dirPath,
    });

    return fileInfoList.map((fileInfo) => ({
      id: nanoid(),
      name: fileInfo.name,
      kind: fileInfo.kind === "directory" ? "directory" : "file",
      path: fileInfo.path,
    }));
  } catch (error) {
    return handleTauriError(error, `read directory: ${dirPath}`);
  }
}

// Function to create a directory with error handling
export async function createDirectory(path: string): Promise<void> {
  try {
    await invoke<void>("create_directory", { path });
  } catch (error) {
    return handleTauriError(error, `create directory: ${path}`);
  }
}

// Function to remove a directory with error handling
export async function removeDirectory(path: string): Promise<void> {
  try {
    await invoke<void>("remove_directory", { path });
  } catch (error) {
    return handleTauriError(error, `remove directory: ${path}`);
  }
}

// Function to read a file with error handling
export async function readFile(path: string): Promise<string> {
  try {
    return await invoke<string>("read_file", { path });
  } catch (error) {
    return handleTauriError(error, `read file: ${path}`);
  }
}

// Function to create a file with error handling
export async function createFile(path: string): Promise<void> {
  try {
    await invoke<void>("create_file", { path });
  } catch (error) {
    return handleTauriError(error, `create file: ${path}`);
  }
}

// Function to write to a file with error handling
export async function writeFile(path: string, content: string): Promise<void> {
  try {
    await invoke<void>("write_file", { path, content });
  } catch (error) {
    return handleTauriError(error, `write to file: ${path}`);
  }
}

// Function to remove a file with error handling
export async function removeFile(path: string): Promise<void> {
  try {
    await invoke<void>("remove_file", { path });
  } catch (error) {
    return handleTauriError(error, `remove file: ${path}`);
  }
}

// Function to rename a file or directory with error handling
export async function rename(oldPath: string, newPath: string): Promise<void> {
  try {
    await invoke<void>("rename", { oldPath, newPath });
  } catch (error) {
    return handleTauriError(error, `rename ${oldPath} to ${newPath}`);
  }
}

// Optional: Type guard to check if an error is a TauriError
export function isTauriError(error: unknown): error is TauriError {
  return (
    typeof error === "object" &&
    error !== null &&
    "kind" in error &&
    "message" in error &&
    typeof (error as TauriError).kind === "string" &&
    typeof (error as TauriError).message === "string"
  );
}
