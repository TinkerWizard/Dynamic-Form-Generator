import React, { useState } from 'react';
import JsonEditor from './components/JsonEditor';
import FormPreview from './components/FormPreview';
import { Box, Stack } from '@mui/material';

const defaultJson = JSON.stringify({
  formTitle: "Sample Form",
  formDescription: "Edit the JSON to see updates in real-time.",
  fields: []
}, null, 2);

const App: React.FC = () => {
  const [json, setJson] = useState(defaultJson);

  let parsedSchema;
  try {
    parsedSchema = JSON.parse(json);
  } catch (err) {
    parsedSchema = null;
  }

  return (
    <Stack
      spacing={2}
      direction="row"
    >

      <JsonEditor json={json} onJsonChange={setJson} />
      {parsedSchema ? <FormPreview schema={parsedSchema} /> : <p>Invalid JSON</p>}
    </Stack>
  );
};

export default App;
