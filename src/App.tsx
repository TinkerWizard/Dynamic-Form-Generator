"use client";

import { useTheme } from "./utils/ThemeContext";
import FormPreview from "./components/FormPreview";
import JsonEditor from "./components/JsonEditor";
import ThemeToggle from "./components/ThemeToggle";
import './tailwind.css';
import { FormSchema } from "./types/schema";
import { useState, useCallback } from "react";
import { Box, Stack } from '@mui/material';
interface ParsedState {
  schema: FormSchema | null;
  error: string | null;
}

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

  return (
    <Stack spacing={2} direction="column" className={`min-h-screen ${isDarkMode ? 'bg-gray-900 text-white' : 'bg-white text-gray-900'}`} sx={{ width: "100vw", p: 3 }}>
      <ThemeToggle />
      <Stack direction="row">
        <Box sx={{ width: "50vw" }} className="space-y-4">
          <h2 className="text-xl font-bold">JSON Schema Editor</h2>
          {jsonInput != null
            &&
            <JsonEditor
              value={jsonInput}
              onChange={handleJsonChange}
              error={parsedState.error}
            />
          }
        </Box>

        <Box sx={{ width: "50vw" }} className="space-y-4">
          <h2 className="text-xl font-bold">Form Preview</h2>
          {parsedState.schema && <FormPreview schema={parsedState.schema} />}
          {parsedState.error && (
            <div className="p-4 bg-red-100 text-red-700 rounded-md">
              {parsedState.error}
            </div>
          )}
        </Box>
      </Stack>

    </Stack>
  );
};

export default App;