// src/types/schema.ts
export interface ValidationRules {
    required?: boolean;
    minLength?: number;
    maxLength?: number;
    pattern?: string;
    min?: number;
    max?: number;
    [key: string]: any; // Allow additional validation rules
  }
  
  export interface FormField {
    name: string;
    type: string;
    label: string;
    required?: boolean;
    validation?: ValidationRules;
    options?: Array<{ label: string; value: string | number }>;
    placeholder?: string;
    defaultValue?: any;
    [key: string]: any; // Allow additional field properties
  }
  
  export interface FormSchema {
    title: string;
    fields: FormField[];
    [key: string]: any; // Allow additional schema properties
  }