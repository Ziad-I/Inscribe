import { useState } from "react";
import { invoke } from "@tauri-apps/api/core";
import "./App.css";
import Sidebar from "@/components/Sidebar";
import { SourceProvider } from "./context/SourceContext";
import Tabs from "./components/Tabs";
import CodeEditor from "./components/CodeEditor";
import Editor from "./components/CodeEditor/Editor";

function App() {
  return (
    <main className="flex h-screen bg-background overflow-hidden">
      <SourceProvider>
        <Sidebar />
        <div className="flex flex-col w-[calc(100%-15rem)] h-full">
          <Tabs />
          <div className="h-[calc(100%-2.5rem)]">
            <Editor />
          </div>
        </div>
      </SourceProvider>
    </main>
  );
}

export default App;
