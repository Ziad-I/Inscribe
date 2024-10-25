import { useState } from "react";
import { invoke } from "@tauri-apps/api/core";
import "./App.css";
import Sidebar from "@/components/Sidebar";
import { SourceProvider } from "./context/SourceContext";
import Tabs from "./components/Tabs";
import CodeEditor from "./components/CodeEditor";

function App() {
  return (
    <main className="flex h-screen bg-background overflow-hidden">
      <SourceProvider>
        <Sidebar />
        {/* Adjusted width of the main content to account for the sidebar width */}
        <div className="flex flex-col w-[calc(100%-15rem)] h-full">
          {/* 15rem = 60 (sidebar width) */}
          <Tabs />
          <div className="flex-grow">
            <CodeEditor />
          </div>
        </div>
      </SourceProvider>
    </main>
  );
}

export default App;
