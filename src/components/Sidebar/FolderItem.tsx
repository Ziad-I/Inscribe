import { useState, MouseEvent } from "react";
import { readDirectory } from "@/api/tauri";
import { IFile } from "@/types/definitions";
import FileIcon from "./FileIcons";
import FileView from "./FileView";

interface FolderItemProps {
  file: IFile;
  active: boolean;
  showContextMenu: (file: IFile) => void;
}

export default function FolderItem({
  file,
  active,
  showContextMenu,
}: FolderItemProps) {
  const [expanded, setExpanded] = useState(false);
  const [files, setFiles] = useState<IFile[]>([]);
  const [loaded, setLoaded] = useState(false);

  const handleClick = async (e: MouseEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();

    if (loaded) {
      setExpanded(!expanded);
      return;
    }

    const filesList = await readDirectory(file.path);
    if (!filesList) return;

    setFiles(filesList);
    setLoaded(true);
    setExpanded(true);
  };

  return (
    <div className="flex flex-col">
      <div
        onClick={handleClick}
        onContextMenu={(e) => {
          e.preventDefault();
          showContextMenu(file);
        }}
        className={`${
          active
            ? "bg-selection text-ivory"
            : "hover:bg-highlightBackground hover:text-ivory"
        } flex items-center gap-2 px-2 py-0.5 text-stone cursor-pointer`}
      >
        <FileIcon name="folder" />
        <div className="flex items-center justify-between w-full group">
          <span>{file.name}</span>
        </div>
      </div>
      {expanded && <FileView visible={expanded} files={files} nested={true} />}
    </div>
  );
}
