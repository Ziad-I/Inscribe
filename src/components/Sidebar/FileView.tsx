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
  const { selected, setSelected, addOpenedFile } = useSourceContext();

  const handleClick = (e: MouseEvent<HTMLDivElement>, file: IFile) => {
    e.preventDefault();
    e.stopPropagation();

    if (file.kind === "file") {
      setSelected(file.id);
      addOpenedFile(file.id);
    } else if (file.kind === "directory") {
      // TODO: handle clicking on a directory
    }
  };

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
          <FileItem
            key={file.id}
            file={file}
            isSelected={isSelected}
            handleClick={handleClick}
          />
        );
      })}
    </div>
  );
}
