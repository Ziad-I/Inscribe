import { useState } from "react";
import { invoke } from "@tauri-apps/api/core";
import "./App.css";
import Sidebar from "@/components/Sidebar";
import { SourceProvider } from "./context/SourceContext";

function App() {
  return (
    <main className="flex bg-background">
      <SourceProvider>
        <Sidebar />
      </SourceProvider>
    </main>
  );
}

export default App;
