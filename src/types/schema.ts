// Field Types
export type FieldType =
  | "text"
  | "email"
  | "textarea"
  | "file"
  | "select"
  | "checkbox"
  | "radio"
  | "date"
  | "number"
  | "password"
  | "tel";

// Validation Rules
export interface ValidationRule {
  pattern: string;
  message: string;
  min?: number;
  max?: number;
  minLength?: number;
  maxLength?: number;
  customValidator?: (value: any) => boolean | Promise<boolean>;
}

// Option Type for Select, Radio, and Checkbox fields
export interface FieldOption {
  value: string;
  label: string;
  disabled?: boolean;
}

// Base Field Interface
interface BaseField {
  id: string;
  label: string;
  required: boolean;
  disabled?: boolean;
  hidden?: boolean;
  description?: string;
  className?: string;
  defaultValue?: any;
  placeholder?: string;
  validation?: ValidationRule;
}

// Text Field Interface
export interface TextField extends BaseField {
  type: "text" | "email";
  minLength?: number;
  maxLength?: number;
  autocomplete?: string;
}

// Textarea Field Interface
export interface TextareaField extends BaseField {
  type: "textarea";
  rows?: number;
  cols?: number;
  maxLength?: number;
  resizable?: boolean;
}

// File Field Interface
export interface FileField extends BaseField {
  type: "file";
  accept?: string;
  multiple?: boolean;
  maxSize?: number; // in bytes
  allowedTypes?: string[];
}

// Select Field Interface
export interface SelectField extends BaseField {
  type: "select";
  options: FieldOption[];
  multiple?: boolean;
  searchable?: boolean;
  clearable?: boolean;
}

// Checkbox Field Interface
export interface CheckboxField extends BaseField {
  type: "checkbox";
  options?: FieldOption[]; // For multiple checkboxes
  checked?: boolean; // For single checkbox
}

// Radio Field Interface
export interface RadioField extends BaseField {
  type: "radio";
  options: FieldOption[];
  inline?: boolean;
}

// Number Field Interface
export interface NumberField extends BaseField {
  type: "number";
  min?: number;
  max?: number;
  step?: number;
}

// Date Field Interface
export interface DateField extends BaseField {
  type: "date";
  minDate?: string;
  maxDate?: string;
  dateFormat?: string;
}

// Union type for all field types
export type Field =
  | TextField
  | TextareaField
  | FileField
  | SelectField
  | CheckboxField
  | RadioField
  | NumberField
  | DateField;

// Form Schema Interface
export interface FormSchema {
  id?: string;
  formTitle: string;
  formDescription?: string;
  fields: Field[];
  submitButtonText?: string;
  resetButtonText?: string;
  showReset?: boolean;
  className?: string;
  onSubmit?: (data: any) => void | Promise<void>;
  onReset?: () => void;
  validation?: {
    mode?: "onBlur" | "onChange" | "onSubmit";
    reValidateMode?: "onBlur" | "onChange" | "onSubmit";
  };
  layout?: {
    columns?: 1 | 2 | 3 | 4;
    spacing?: "normal" | "compact" | "relaxed";
    labelPosition?: "top" | "left" | "right";
  };
}

// Form Field Values Type
export type FormValues<T extends FormSchema> = {
  [K in T["fields"][number]["id"]]: any;
};

// Helper type to extract field type
export type FieldTypeFromSchema<T extends Field> = T extends { type: infer R }
  ? R
  : never;

// Validation Errors Type
export interface ValidationError {
  field: string;
  message: string;
  type:
    | "required"
    | "pattern"
    | "min"
    | "max"
    | "minLength"
    | "maxLength"
    | "custom";
}
