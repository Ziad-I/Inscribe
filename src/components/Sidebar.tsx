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
      (selected as string).split("\\").pop() || "No Project Selected";
    setProject(projectName);

    // const filesList = await readDirectory(selected);
    const filesList: IFile[] = [
      {
        id: "1",
        name: "src",
        kind: "directory",
        path: "/src",
      },
      {
        id: "2",
        name: "index.ts",
        kind: "file",
        path: "/src/index.ts",
      },
      {
        id: "3",
        name: "components",
        kind: "directory",
        path: "/src/components",
      },
      {
        id: "4",
        name: "App.tsx",
        kind: "file",
        path: "/src/App.tsx",
      },
      {
        id: "5",
        name: "utils",
        kind: "directory",
        path: "/src/utils",
      },
      {
        id: "6",
        name: "helpers.ts",
        kind: "file",
        path: "/src/utils/helpers.ts",
      },
      {
        id: "7",
        name: "README.md",
        kind: "file",
        path: "/README.md",
      },
    ];
    if (!filesList) return;
    setFiles(filesList);
  };
  return (
    <aside className="w-60 shrink-0 h-full bg-darkBackground">
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
      <div className="px-2 overflow-y-auto h-screen">
        <FileView visible={true} files={files} nested={false} />
      </div>
    </aside>
  );
}
