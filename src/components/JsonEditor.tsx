import React, { useState } from 'react';
import Editor from '@monaco-editor/react';
import { Box } from '@mui/material';

interface JsonEditorProps {
  json: string;
  onJsonChange: (json: string) => void;
}

const JsonEditor: React.FC<JsonEditorProps> = ({ json, onJsonChange }) => {
  const [error, setError] = useState<string | null>(null);

  const handleEditorChange = (value: string | undefined) => {
    if (!value) return;
    try {
      JSON.parse(value);
      setError(null); // JSON is valid
      onJsonChange(value);
    } catch (err) {
      setError('Invalid JSON');
    }
  };

  return (
    <Box sx={{width:"50vw"}} className="relative h-full">
      <Editor
        height="100vh"
        defaultLanguage="json"
        value={json}
        onChange={handleEditorChange}
        theme="vs-dark"
      />
      {/* Overlay for invalid JSON */}
      {error && (
        <div className="absolute top-0 left-0 w-full h-full bg-red-800 bg-opacity-50 flex flex-col items-center justify-center">
          <p className="text-white text-lg font-bold">{error}</p>
          <p className="text-white text-sm mt-2">
            Please fix the JSON to see updates in the preview.
          </p>
        </div>
      )}
    </Box>
  );
};

export default JsonEditor;
