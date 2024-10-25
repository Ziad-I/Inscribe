import { MouseEvent } from "react";
import { useSourceContext } from "@/context/SourceContext";
import { IFile } from "@/types/definitions";
import FileItem from "./FileItem";
import FolderItem from "./FolderItem";

interface FileViewProps {
  files: IFile[];
  visible: boolean;
  nested: boolean;
}

export default function FileView({ files, visible, nested }: FileViewProps) {
  const { selected } = useSourceContext();

  return (
    <div
      className={`max-h-full overflow-y-auto ${visible ? "" : "hidden"}
     ${nested ? "pl-1 ml-2 relative border-l border-dotted border-stone" : ""}`}
    >
      {files.map((file) => {
        const isSelected = file.id === selected;
        return file.kind === "directory" ? (
          <FolderItem key={file.id} file={file} active={isSelected} />
        ) : (
          <FileItem key={file.id} file={file} isSelected={isSelected} />
        );
      })}
    </div>
  );
}
