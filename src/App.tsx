import { useTheme } from "./utils/ThemeContext";
import FormPreview from "./components/FormPreview";
import JsonEditor from "./components/JsonEditor";
import ThemeToggle from "./components/ThemeToggle";
import './tailwind.css';
import { FormSchema } from "./types/schema";
import { useState, useCallback } from "react";

interface ParsedState {
  schema: FormSchema | null;
  error: string | null;
}

const EditorSection = ({ 
  title, 
  children 
}: { 
  title: string;
  children: React.ReactNode;
}) => (
  <div className="space-y-4">
    <h2 className="text-xl font-bold">{title}</h2>
    {children}
  </div>
);

const ErrorMessage = ({ message }: { message: string }) => (
  <div className="p-4 bg-red-100 text-red-700 rounded-md">
    {message}
  </div>
);

const App = () => {
  const { isDarkMode } = useTheme();
  const [jsonInput, setJsonInput] = useState<string>("");
  const [parsedState, setParsedState] = useState<ParsedState>({
    schema: null,
    error: null,
  });

  const parseJsonSchema = useCallback((json: string): ParsedState => {
    try {
      const parsed = JSON.parse(json) as FormSchema;
      return { schema: parsed, error: null };
    } catch (e) {
      return {
        schema: null,
        error: `Invalid JSON format: ${e instanceof Error ? e.message : String(e)}`
      };
    }
  }, []);

  const handleJsonChange = useCallback((newJson: string) => {
    setJsonInput(newJson);
    setParsedState(parseJsonSchema(newJson));
  }, [parseJsonSchema]);

  const mainClassName = `min-h-screen p-6 ${
    isDarkMode ? 'bg-gray-900 text-white' : 'bg-white text-gray-900'
  }`;

  return (
    <div>
      {/* Desktop */}
      <div className="hidden xl:block">
        <div className={`${mainClassName} flex flex-col w-full`}>
          <ThemeToggle />
          <div className="flex flex-row gap-4">
            <div className="w-1/2">
              <EditorSection title="JSON Schema Editor">
                {jsonInput != null && (
                  <JsonEditor
                    jsonSchema={jsonInput}
                    onChange={handleJsonChange}
                    error={parsedState.error}
                  />
                )}
              </EditorSection>
            </div>
            <div className="w-1/2">
              <EditorSection title="Form Preview">
                {parsedState.schema && <FormPreview schema={parsedState.schema} />}
                {parsedState.error && <ErrorMessage message={parsedState.error} />}
              </EditorSection>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile */}
      <div className="block sm:hidden">
        <div className={`${mainClassName} flex flex-col w-full`}>
          <ThemeToggle />
          <div className="flex flex-col gap-4">
            <EditorSection title="JSON Schema Editor">
              {jsonInput != null && (
                <JsonEditor
                  jsonSchema={jsonInput}
                  onChange={handleJsonChange}
                  error={parsedState.error}
                />
              )}
            </EditorSection>
            <EditorSection title="Form Preview">
              {parsedState.schema && <FormPreview schema={parsedState.schema} />}
              {parsedState.error && <ErrorMessage message={parsedState.error} />}
            </EditorSection>
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;