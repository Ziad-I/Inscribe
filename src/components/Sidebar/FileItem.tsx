import { MouseEvent } from "react";
import { IFile } from "@/types/definitions";
import FileIcon from "./FileIcons";

interface FileItemProps {
  file: IFile;
  isSelected: boolean;
  handleClick: (e: MouseEvent<HTMLDivElement>, file: IFile) => void;
}

export default function FileItem({
  file,
  isSelected,
  handleClick,
}: FileItemProps) {
  return (
    <div
      onClick={(e) => handleClick(e, file)}
      className={`
        ${
          isSelected
            ? "bg-selection text-ivory"
            : "hover:bg-highlightBackground hover:text-ivory"
        }
        flex items-center gap-2 px-2 py-0.5 text-stone  cursor-pointer`}
    >
      <FileIcon name={file.name} />
      <span>{file.name}</span>
    </div>
  );
}
