import React, { useMemo, useCallback } from "react";
import Editor, { EditorProps, Monaco } from "@monaco-editor/react";
import { useTheme } from "../utils/ThemeContext";
import { editor } from "monaco-editor";

interface JsonEditorProps {
  jsonSchema: string;
  onChange: (value: string) => void;
  error: string | null;
  height?: string | number;
  readOnly?: boolean;
  minimapEnabled?: boolean;
  className?: string;
}

const EDITOR_OPTIONS: editor.IStandaloneEditorConstructionOptions = {
  minimap: {
    enabled: false
  },
  lineNumbers: 'on',
  roundedSelection: true,
  scrollBeyondLastLine: false,
  automaticLayout: true,
  formatOnPaste: true,
  formatOnType: true,
  wordWrap: 'on',
  fontSize: 14,
  tabSize: 2,
  autoIndent: "advanced"
};

const JsonEditor: React.FC<JsonEditorProps> = ({
  jsonSchema,
  onChange,
  error,
  height = "70vh",
  readOnly = false,
  minimapEnabled = true,
  className = "",
}) => {
  const { isDarkMode } = useTheme();

  // Memoized editor options
  const editorOptions = useMemo(() => ({
    ...EDITOR_OPTIONS,
    minimap: { enabled: minimapEnabled },
    readOnly,
  }), [minimapEnabled, readOnly]);

  // Handle editor mounting
  const handleEditorDidMount = useCallback((editor: editor.IStandaloneCodeEditor, monaco: Monaco) => {
    // Configure JSON language features
    monaco.languages.json.jsonDefaults.setDiagnosticsOptions({
      validate: true,
      schemas: [],
      allowComments: false,
      schemaValidation: 'error',
    });

    // Add keyboard shortcuts
    editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyS, () => {
      editor.getAction('editor.action.formatDocument').run();
    });
  }, []);

  // Handle value change with validation
  const handleChange = useCallback((value: string | undefined) => {
    try {
      // Attempt to parse JSON to validate
      if (value) {
        JSON.parse(value);
      }
      onChange(value || "");
    } catch (e) {
      // Invalid JSON will be handled by the error prop
      onChange(value || "");
    }
  }, [onChange]);

  return (
    <div
      className={`p-4 rounded-lg transition-colors duration-200 ${
        isDarkMode 
          ? "bg-gray-900 border border-gray-700 text-white"
          : "bg-white border border-gray-200 text-gray-900"
      } ${className}`}
      role="region"
      aria-label="JSON Editor"
    >
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">JSON Editor</h2>
        {readOnly && (
          <span className="px-2 py-1 text-xs font-medium rounded bg-gray-200 text-gray-700">
            Read Only
          </span>
        )}
      </div>

      <div className="relative rounded-md overflow-hidden border border-gray-200 dark:border-gray-700">
        <Editor
          height={height}
          language="json"
          theme={isDarkMode ? "vs-dark" : "vs-light"}
          value={jsonSchema}
          onChange={handleChange}
          options={editorOptions}
          onMount={handleEditorDidMount}
          loading={
            <div className="flex items-center justify-center h-full">
              <span className="animate-pulse">Loading editor...</span>
            </div>
          }
        />
      </div>

      {error && (
        <div
          role="alert"
          className="mt-2 p-2 rounded bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800"
        >
          <p className="text-red-600 dark:text-red-400 text-sm font-medium">
            {error}
          </p>
        </div>
      )}
    </div>
  );
};

export default React.memo(JsonEditor);

// Usage Example:
/*
import JsonEditor from './JsonEditor';

const MyComponent = () => {
  const [jsonValue, setJsonValue] = useState("{\n  \"key\": \"value\"\n}");
  const [error, setError] = useState<string | null>(null);

  const handleChange = (value: string) => {
    try {
      JSON.parse(value);
      setError(null);
    } catch (e) {
      setError("Invalid JSON syntax");
    }
    setJsonValue(value);
  };

  return (
    <JsonEditor
      jsonSchema={jsonValue}
      onChange={handleChange}
      error={error}
      minimapEnabled={true}
      height="500px"
    />
  );
};
*/