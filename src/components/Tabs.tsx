import { MouseEvent } from "react";
import { useSourceContext } from "@/context/SourceContext";
import useHorizontalScroll from "@/hooks/UseHorizontalScroll";
import { getFileEntry } from "@/stores/FileStore";
import FileIcon from "./Sidebar/FileIcons";

export default function Tabs() {
  const { selected, setSelected, opened, removeOpenedFile } =
    useSourceContext();
  const scrollRef = useHorizontalScroll();

  const closeFile = (e: MouseEvent, id: string) => {
    e.stopPropagation();
    removeOpenedFile(id);
  };

  return (
    <div
      ref={scrollRef}
      className="h-10 flex items-center bg-darkBackground border-b border-stone divide-x divide-stone overflow-x-auto overflow-y-hidden"
    >
      {opened.map((fileId) => {
        const file = getFileEntry(fileId);
        const isActive = selected === file.id;

        return (
          <div
            className={`flex items-center gap-2 shrink-0 px-5 py-1.5 bg-darkBackground text-stone hover:bg-highlightBackground hover:text-ivory cursor-pointer
                ${isActive ? "bg-highlightBackground text-ivory" : ""}`}
            key={fileId}
            onClick={() => setSelected(fileId)}
          >
            <FileIcon name={file.name} />
            <span>{file.name}</span>
            {/* Replace <i> with <button> */}
            <button
              onClick={(e) => closeFile(e, fileId)}
              className="hover:text-red-400 ml-2 hover:bg-background focus:outline-none px-1"
              aria-label={`Close ${file.name}`}
            >
              X
            </button>
          </div>
        );
      })}
    </div>
  );
}
