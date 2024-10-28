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
        <div className="flex flex-col w-[calc(100%-15rem)] h-full">
          <Tabs />
          <div className="h-[calc(100%-2.5rem)]">
            <CodeEditor />
          </div>
        </div>
      </SourceProvider>
    </main>
  );
}

export default App;
