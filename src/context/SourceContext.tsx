import {
  createContext,
  useContext,
  useState,
  useCallback,
  ReactNode,
} from "react";

interface SourceContext {
  selected: string;
  opened: string[];
  setSelected(id: string): void;
  addOpenedFile(id: string): void;
  removeOpenedFile(id: string): void;
}

const SourceContext = createContext<SourceContext>({
  selected: "",
  opened: [],
  setSelected: (id) => {},
  addOpenedFile: (id) => {},
  removeOpenedFile: (id) => {},
});

interface SourceProviderProps {
  children: ReactNode;
}

export const SourceProvider = ({ children }: SourceProviderProps) => {
  const [selected, setSelected] = useState<string>("");
  const [opened, setOpened] = useState<string[]>([]);

  const addOpenedFile = useCallback(
    (id: string) => {
      if (!opened.includes(id)) {
        setOpened([...opened, id]);
      }
    },
    [opened]
  );

  const removeOpenedFile = useCallback(
    (id: string) => {
      setOpened(opened.filter((fileId) => fileId !== id));
    },
    [opened]
  );

  return (
    <SourceContext.Provider
      value={{
        selected,
        opened,
        setSelected,
        addOpenedFile,
        removeOpenedFile,
      }}
    >
      {children}
    </SourceContext.Provider>
  );
};

export const useSourceContext = () => {
  const context = useContext(SourceContext);
  if (!context) {
    throw new Error("useSourceContext must be used within a SourceProvider");
  }
  return context;
};
