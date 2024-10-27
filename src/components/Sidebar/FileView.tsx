import { useCallback, useRef } from "react";
import { useSourceContext } from "@/context/SourceContext";
import FileItem from "./FileItem";
import FolderItem from "./FolderItem";
import { IFile } from "@/types/definitions";
import { Menu, MenuItem, PredefinedMenuItem } from "@tauri-apps/api/menu";

interface FileViewProps {
  files: IFile[];
  visible: boolean;
  nested: boolean;
}

export default function FileView({ files, visible, nested }: FileViewProps) {
  const { selected } = useSourceContext();
  const containerRef = useRef<HTMLDivElement>(null);

  const showContextMenu = useCallback(async (file: IFile) => {
    const menuItems = await Promise.all([
      MenuItem.new({
        id: "new-folder",
        text: "New Folder",
        accelerator: "CmdOrCtrl+Shift+N",
        action: () => {
          console.log("Creating new folder: " + file.name);
          // Add your folder creation logic here
        },
      }),
      PredefinedMenuItem.new({ item: "Separator" }),
      MenuItem.new({
        id: "new-file",
        text: "New File",
        accelerator: "CmdOrCtrl+N",
        action: () => {
          console.log("Creating new file: " + file.name);
          // Add your file creation logic here
        },
      }),
      PredefinedMenuItem.new({ item: "Separator" }),
      MenuItem.new({
        id: "rename",
        text: "Rename",
        accelerator: "F2",
        action: () => {
          console.log("Renaming item: " + file.name);
          // Add your rename logic here
        },
      }),
    ]);

    const menu = await Menu.new({
      items: menuItems,
    });

    await menu.popup().catch(console.error);
  }, []);

  return (
    <div
      ref={containerRef}
      className={`max-h-full overflow-y-auto ${visible ? "" : "hidden"}
     ${nested ? "pl-1 ml-2 relative border-l border-dotted border-stone" : ""}
     overflow-x-hidden whitespace-nowrap text-ellipsis`}
    >
      {files.map((file) => {
        const isSelected = file.id === selected;
        return file.kind === "directory" ? (
          <FolderItem
            key={file.id}
            file={file}
            active={isSelected}
            showContextMenu={showContextMenu}
          />
        ) : (
          <FileItem
            key={file.id}
            file={file}
            isSelected={isSelected}
            showContextMenu={showContextMenu}
          />
        );
      })}
    </div>
  );
}
