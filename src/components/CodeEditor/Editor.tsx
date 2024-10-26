import { useEffect, useRef, useState } from "react";
import { LanguageSupport } from "@codemirror/language";
import { languages } from "@codemirror/language-data";
import { EditorState } from "@codemirror/state";
import { keymap } from "@codemirror/view";
import { EditorView, basicSetup } from "codemirror";
import { useSourceContext } from "@/context/SourceContext";
import { getFileEntry } from "@/stores/FileStore";
import { readFile, writeFile } from "@/api/tauri";
import { EditorTheme } from "./EditorTheme";

const languageSupports: Record<string, LanguageSupport> = {};

// Load all languages dynamically
async function loadAllLanguages() {
  const loadPromises = languages.map(async (lang) => {
    try {
      const languageSupport = await lang.load();
      languageSupports[lang.name.toLowerCase()] = languageSupport;
    } catch (error) {
      console.error(`Failed to load language: ${lang.name}`, error);
    }
  });

  await Promise.all(loadPromises);
}

// Get language support based on file extension
function getLanguageSupport(filename: string): LanguageSupport | null {
  const extension = filename.split(".").pop()?.toLowerCase() || "";

  const extensionToLanguage: Record<string, string> = {
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
    // Add more mappings as needed
  };

  const languageName = extensionToLanguage[extension];
  return languageSupports[languageName] || null;
}

// Create a save command
const createSaveCommand = (path: string) => {
  return {
    key: "Ctrl-s",
    run: (view: EditorView) => {
      (async () => {
        try {
          await writeFile(path, view.state.doc.toString());
          console.log("File saved successfully");
        } catch (error) {
          console.error("Failed to save file:", error);
        }
      })();
      return true; // Return true synchronously
    },
    preventDefault: true,
  };
};

export default function Editor() {
  const { selected } = useSourceContext();
  const [isLoading, setIsLoading] = useState(true);
  const editorRef = useRef<EditorView | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    loadAllLanguages().then(() => setIsLoading(false));
  }, []);

  useEffect(() => {
    if (!selected || isLoading || !containerRef.current) return;

    const fileEntry = getFileEntry(selected);
    if (!fileEntry) return;

    const loadAndSetupEditor = async () => {
      try {
        // Read file content
        const content = await readFile(fileEntry.path);

        // Get language support
        const languageSupport = getLanguageSupport(fileEntry.name);

        // Create save command
        const saveCommand = createSaveCommand(fileEntry.path);

        // Create editor state
        const state = EditorState.create({
          doc: content,
          extensions: [
            basicSetup,
            EditorTheme,
            keymap.of([saveCommand]),
            ...(languageSupport ? [languageSupport] : []),
          ],
        });

        // Destroy existing editor if it exists
        if (editorRef.current) {
          editorRef.current.destroy();
        }

        // Create new editor
        const view = new EditorView({
          state,
          parent: containerRef.current || undefined,
        });

        editorRef.current = view;
      } catch (error) {
        console.error("Failed to load file:", error);
      }
    };

    loadAndSetupEditor();

    // Cleanup
    return () => {
      if (editorRef.current) {
        editorRef.current.destroy();
      }
    };
  }, [selected, isLoading]);

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

  return <div ref={containerRef} className="h-full w-full overflow-hidden" />;
}
