import { useEffect, useRef, useState, useCallback } from "react";
import { LanguageSupport } from "@codemirror/language";
import { languages } from "@codemirror/language-data";
import { EditorState } from "@codemirror/state";
import { keymap } from "@codemirror/view";
import { indentWithTab } from "@codemirror/commands";
import { EditorView, basicSetup } from "codemirror";
import { useSourceContext } from "@/context/SourceContext";
import { getFileEntry } from "@/stores/FileStore";
import { readFile, writeFile } from "@/api/tauri";
import { EditorTheme } from "./EditorTheme";
import { IFile } from "@/types/definitions";

import { bracketMatching, foldKeymap } from "@codemirror/language";
import { autocompletion } from "@codemirror/autocomplete";
import { searchKeymap } from "@codemirror/search";
import { highlightActiveLine } from "@codemirror/view";

const EXTENSION_TO_LANGUAGE: Readonly<Record<string, string>> = {
  js: "javascript",
  ts: "typescript",
  jsx: "javascript",
  tsx: "typescript",
  py: "python",
  rs: "rust",
  go: "go",
  html: "html",
  css: "css",
  json: "json",
  md: "markdown",
};

const languageSupports = new Map<string, LanguageSupport>();

const loadAllLanguages = async (): Promise<void> => {
  if (languageSupports.size > 0) return;

  const loadPromises = languages.map(async (lang) => {
    try {
      const languageSupport = await lang.load();
      languageSupports.set(lang.name.toLowerCase(), languageSupport);
    } catch (error) {
      console.error(`Failed to load language: ${lang.name}`, error);
      throw new Error(`Language loading failed: ${lang.name}`);
    }
  });

  await Promise.allSettled(loadPromises);
};

const getLanguageSupport = (filename: string): LanguageSupport | null => {
  const extension = filename.split(".").pop()?.toLowerCase() || "";
  const languageName = EXTENSION_TO_LANGUAGE[extension];
  return languageSupports.get(languageName) || null;
};

const createSaveCommand = (path: string) => ({
  key: "Ctrl-s",
  mac: "Cmd-s",
  run: (view: EditorView) => {
    void (async () => {
      try {
        await writeFile(path, view.state.doc.toString());
        //TODO: Could add a toast notification here
      } catch (error) {
        console.error("Failed to save file:", error);
        //TODO: Could add error notification here
      }
    })();
    return true;
  },
  preventDefault: true,
});

export default function Editor() {
  const { selected } = useSourceContext();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const editorRef = useRef<EditorView | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const initializeEditor = useCallback(async (fileEntry: IFile) => {
    try {
      const content = await readFile(fileEntry.path);
      const languageSupport = getLanguageSupport(fileEntry.name);
      const saveCommand = createSaveCommand(fileEntry.path);

      const state = EditorState.create({
        doc: content,
        extensions: [
          basicSetup,
          EditorTheme,
          keymap.of([
            saveCommand,
            indentWithTab,
            ...foldKeymap,
            ...searchKeymap,
          ]),
          autocompletion(),
          bracketMatching(),
          highlightActiveLine(),
          ...(languageSupport ? [languageSupport] : []),
        ],
      });

      if (editorRef.current) {
        editorRef.current.destroy();
      }

      if (!containerRef.current) {
        throw new Error("Editor container not found");
      }

      editorRef.current = new EditorView({
        state,
        parent: containerRef.current,
      });
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to initialize editor";
      setError(errorMessage);
      console.error("Editor initialization failed:", error);
    }
  }, []);

  useEffect(() => {
    loadAllLanguages()
      .then(() => setIsLoading(false))
      .catch((error) => {
        setError("Failed to load language support");
        console.error("Language loading failed:", error);
      });
  }, []);

  useEffect(() => {
    if (!selected || isLoading) return;

    const fileEntry = getFileEntry(selected);
    if (!fileEntry) {
      setError("Invalid file selected");
      return;
    }

    initializeEditor(fileEntry);

    return () => editorRef.current?.destroy();
  }, [selected, isLoading, initializeEditor]);

  if (!selected) {
    return (
      <div className="h-full w-full flex items-center justify-center text-stone">
        No file selected
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="h-full w-full flex items-center justify-center text-stone">
        Loading...
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-full w-full flex items-center justify-center text-red-500">
        {error}
      </div>
    );
  }

  return <div ref={containerRef} className="h-full w-full overflow-hidden" />;
}
