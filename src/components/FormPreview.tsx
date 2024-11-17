import React from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { TextField, Button, Select, MenuItem, FormControl, InputLabel, RadioGroup, FormControlLabel, Radio, TextareaAutosize, Box } from '@mui/material';

interface FormPreviewProps {
  schema: any;
}

const FormPreview: React.FC<FormPreviewProps> = ({ schema }) => {
  const { register, handleSubmit, formState: { errors } } = useForm();

  const onSubmit: SubmitHandler<any> = (data) => {
    console.log(data);
    alert('Form submitted successfully!');
  };

  return (
    <Box className="p-4">
      <h2 className="text-lg font-bold mb-4">{schema?.formTitle || 'Dynamic Form'}</h2>
      <p className="mb-4">{schema?.formDescription}</p>
      <form onSubmit={handleSubmit(onSubmit)}>
        {schema?.fields?.map((field: any) => {
          if (field.type === 'text' || field.type === 'email') {
            return (
              <TextField
                key={field.id}
                label={field.label}
                type={field.type}
                {...register(field.id, { required: field.required })}
                placeholder={field.placeholder}
                fullWidth
                margin="normal"
                error={!!errors[field.id]}
                helperText={errors[field.id] && `${field.label} is required`}
              />
            );
          }
          if (field.type === 'select') {
            return (
              <FormControl fullWidth margin="normal" key={field.id}>
                <InputLabel>{field.label}</InputLabel>
                <Select {...register(field.id, { required: field.required })}>
                  {field.options.map((option: any) => (
                    <MenuItem value={option.value} key={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            );
          }
          if (field.type === 'radio') {
            return (
              <FormControl component="fieldset" margin="normal" key={field.id}>
                <RadioGroup {...register(field.id, { required: field.required })}>
                  {field.options.map((option: any) => (
                    <FormControlLabel
                      value={option.value}
                      control={<Radio />}
                      label={option.label}
                      key={option.value}
                    />
                  ))}
                </RadioGroup>
              </FormControl>
            );
          }
          if (field.type === 'textarea') {
            return (
              <TextareaAutosize
                minRows={4}
                placeholder={field.placeholder}
                {...register(field.id, { required: field.required })}
                key={field.id}
                style={{ width: '100%', marginBottom: '16px', padding: '8px', borderRadius: '4px', borderColor: '#ccc' }}
              />
            );
          }
          return null;
        })}
        <Button type="submit" variant="contained" color="primary">
          Submit
        </Button>
      </form>
    </Box>
  );
};

export default FormPreview;
