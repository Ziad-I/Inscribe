import { nanoid } from "nanoid";
import { useState, MouseEvent } from "react";
import { readDirectory, writeFile } from "@/api/tauri";
import { IFile } from "@/types/definitions";
import FileIcon from "./FileIcons";
import { useSourceContext } from "@/context/SourceContext";
import FileView from "./FileView";

interface FolderItemProps {
  file: IFile;
  active: boolean;
}

export default function FolderItem({ file, active }: FolderItemProps) {
  const { selected, setSelected } = useSourceContext();

  const [expanded, setExpanded] = useState(false);
  const [files, setFiles] = useState<IFile[]>([]);
  const [newFile, setNewFile] = useState(false);
  const [loaded, setLoaded] = useState(false);

  const handleClick = async (e: MouseEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();

    setSelected(file.id);

    if (loaded) {
      setExpanded(!expanded);
      return;
    }

    // const filesList = await readDirectory(file.path);
    const filesList: IFile[] = [
      {
        id: nanoid(),
        name: "index.js",
        type: "file",
        path: `${file.path}/index.js`,
      },
      {
        id: nanoid(),
        name: "README.md",
        type: "file",
        path: `${file.path}/README.md`,
      },
    ];
    if (filesList.length > 0) {
      setFiles(filesList);
      setLoaded(true);
      setExpanded(true);
    }
  };
  console.log(file.name, active);
  return (
    <div>
      <div
        onClick={handleClick}
        className={`
        ${
          active
            ? "bg-selection text-ivory"
            : "hover:bg-highlightBackground hover:text-ivory"
        }
        flex items-center gap-2 px-2 py-0.5 text-stone cursor-pointer`}
      >
        <FileIcon name="folder" />
        <div className="source-header flex items-center justify-between w-full group">
          <span>{file.name}</span>
          <i
            onClick={() => setNewFile(true)}
            className="invisible text-ivory group-hover:visible"
          >
            +
          </i>
        </div>
        <FileView visible={expanded} files={files} />
      </div>
    </div>
  );
}
