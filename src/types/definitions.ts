export type IFile = {
  id: string;
  name: string;
  type: "file" | "directory";
  path: string;
};
