import { useEffect, useRef, useState, useCallback } from "react";
import { message } from "@tauri-apps/plugin-dialog";
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
import { autocompletion, acceptCompletion } from "@codemirror/autocomplete";
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
      await message(`Language loading failed: ${lang.name}`, {
        kind: "error",
      });
    }
  });

  await Promise.allSettled(loadPromises);
};

const getLanguageSupport = (filename: string): LanguageSupport | null => {
  const extension = filename.split(".").pop()?.toLowerCase() || "";
  const languageName = EXTENSION_TO_LANGUAGE[extension] || "markdown";
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
        await message("Failed to save file", {
          kind: "error",
        });
      }
    })();
    return true;
  },
  preventDefault: true,
});

const createAcceptSuggestionCommand = () => {
  return {
    key: "Tab",
    run: acceptCompletion,
  };
};

export default function CodeEditor() {
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
      const acceptSuggestionCommand = createAcceptSuggestionCommand();

      if (!languageSupport) {
        await message(`Unsupported file extension: ${fileEntry.name}`, {
          kind: "error",
        });
      }

      const state = EditorState.create({
        doc: content,
        extensions: [
          basicSetup,
          EditorTheme,
          keymap.of([
            acceptSuggestionCommand,
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
        await message("Editor container not found", {
          kind: "error",
        });
        return;
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
