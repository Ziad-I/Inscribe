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

    if (file.type === "file") {
      setSelected(file.id);
      addOpenedFile(file.id);
    } else if (file.type === "directory") {
      // TODO: handle clicking on a directory
    }
  };

  return (
    <div
      className={`w-full ${visible ? "" : "hidden"}
     ${nested ? "pl-4 relative border-l border-dotted border-stone-500" : ""}`}
    >
      {files.map((file) => {
        const isSelected = file.id === selected;
        return file.type === "directory" ? (
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
