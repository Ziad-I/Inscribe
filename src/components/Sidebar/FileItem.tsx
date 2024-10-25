import { MouseEvent } from "react";
import { IFile } from "@/types/definitions";
import FileIcon from "./FileIcons";
import { useSourceContext } from "@/context/SourceContext";
import { addFileEntry } from "@/stores/FileStore";

interface FileItemProps {
  file: IFile;
  isSelected: boolean;
}

export default function FileItem({ file, isSelected }: FileItemProps) {
  const { setSelected, addOpenedFile } = useSourceContext();

  const handleClick = (e: MouseEvent<HTMLDivElement>, file: IFile) => {
    e.preventDefault();
    e.stopPropagation();

    if (file.kind === "file") {
      setSelected(file.id);
      addOpenedFile(file.id);
      addFileEntry(file);
    }
  };

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
