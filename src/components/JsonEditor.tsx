import React, { useMemo, useCallback, useState } from "react";
import Editor, { Monaco } from "@monaco-editor/react";
import { useTheme } from "../utils/ThemeContext";
import { editor } from "monaco-editor";
import { Copy, CheckCircle } from "lucide-react";

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
  const [isJsonValid, setIsJsonValid] = useState(false);
  const [copied, setCopied] = useState(false);
  const [currentValue, setCurrentValue] = useState(jsonSchema);

  // Memoized editor options
  const editorOptions = useMemo(() => ({
    ...EDITOR_OPTIONS,
    minimap: { enabled: minimapEnabled },
    readOnly,
  }), [minimapEnabled, readOnly]);

  // Handle editor mounting
  const handleEditorDidMount = useCallback((_editor: editor.IStandaloneCodeEditor, monaco: Monaco) => {
    // Temporarily disable diagnostics for debugging
    monaco.languages.json.jsonDefaults.setDiagnosticsOptions({
      validate: false, // Disable validation for debugging purposes
      schemas: [],
      allowComments: false,
      schemaValidation: 'error',
    });
  }, []);

  // Handle value change with validation
  const handleChange = useCallback((value: string | undefined) => {
    const updatedValue = value ?? "";

    // Always update current value
    setCurrentValue(updatedValue);

    // Always call onChange without validation
    onChange(updatedValue);
  }, [onChange]);

  // Handle copy JSON
  // Handle copy JSON
  const handleCopyJson = () => {
    navigator.clipboard.writeText(currentValue)
      .then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      })
      .catch((err) => {
        console.error('Failed to copy JSON:', err);
      });
  };

  return (
    <div
      className={`p-4 rounded-lg transition-colors duration-200 ${isDarkMode
        ? "bg-gray-900 border border-gray-700 text-white"
        : "bg-white border border-gray-200 text-gray-900"
        } ${className}`}
      role="region"
      aria-label="JSON Editor"
    >
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">JSON Editor</h2>
        <div className="flex items-center space-x-2">
          {readOnly && (
            <span className="px-2 py-1 text-xs font-medium rounded bg-gray-200 text-gray-700">
              Read Only
            </span>
          )}
          <button
            onClick={handleCopyJson}
            className="inline-flex items-center space-x-2 px-3 py-1.5 rounded-lg
        bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600
        text-gray-700 dark:text-gray-200
        transition-colors duration-200
        focus:outline-none focus:ring-2 focus:ring-gray-400"
          >
            {copied ? (
              <CheckCircle className="h-4 w-4 text-green-500" />
            ) : (
              <Copy className="h-4 w-4" />
            )}
            <span className="text-xs">{copied ? 'Copied!' : 'Copy JSON'}</span>
          </button>
        </div>
      </div>
      <div className="relative rounded-md overflow-hidden border border-gray-200 dark:border-gray-700">
        <Editor
          data-testId="editor"
          height={height}
          language="json"
          theme={isDarkMode ? "vs-dark" : "vs-light"}
          value={currentValue}
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