export type IFile = {
  id: string;
  name: string;
  kind: "file" | "directory";
  path: string;
};
