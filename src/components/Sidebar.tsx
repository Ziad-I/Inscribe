import { useState } from "react";
import { IFile } from "@/types/definitions";
import { open } from "@tauri-apps/plugin-dialog";
import { readDirectory } from "@/api/tauri";
import FileView from "@/components/Sidebar/FileView";

export default function Sidebar() {
  const [project, setProject] = useState<string>("No Project Selected");
  const [files, setFiles] = useState<IFile[]>([]);

  const loadProject = async () => {
    console.log("Loading project");
    const selected = await open({
      directory: true,
    });

    if (!selected) return;

    const projectName =
      (selected as string)
        .split(/[/\\]/) // Split on both forward and backslashes
        .pop() || "No Project Selected";
    setProject(projectName);

    const filesList = await readDirectory(selected);
    if (!filesList) return;

    setFiles(filesList);
  };

  return (
    <aside className="w-60 shrink-0 h-full bg-darkBackground border-r border-stone flex flex-col">
      <div className="flex flex-col items-center p-4 py-2.5">
        <button
          className="w-full text-left uppercase text-stone text-xs"
          onClick={loadProject}
        >
          File explorer
        </button>
        <span className="w-full text-left overflow-hidden text-ellipsis whitespace-nowrap text-stone text-xs">
          {project}
        </span>
      </div>
      <div className="flex-grow pl-2 overflow-y-auto">
        <FileView visible={true} files={files} nested={false} />
      </div>
    </aside>
  );
}
