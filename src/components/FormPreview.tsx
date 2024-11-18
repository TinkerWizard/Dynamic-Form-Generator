import React from "react";
import { useForm } from "react-hook-form";
import { useTheme } from "../utils/ThemeContext";
import {
    FormSchema,
    Field,
    type TextField,
    TextareaField,  
    type FileField,
    type SelectField,
    type CheckboxField,
    type RadioField,
    type NumberField,
    type DateField,
    ValidationRule
} from "../types/schema";
import { AlertCircle, Copy, CheckCircle } from "lucide-react";
import { useState } from "react";

interface FormPreviewProps {
    schema: FormSchema | null;
}

interface FieldProps {
    field: Field;
    register: any;
    errors: any;
    isDarkMode: boolean;
}

const TextField: React.FC<FieldProps> = ({ field, register, errors, isDarkMode }) => {
    const textField = field as TextField;
    return (
        <input
            id={field.id}
            type={field.type}
            placeholder={textField.placeholder}
            disabled={textField.disabled}
            autoComplete={textField.autocomplete}
            className={`${getFieldClasses(isDarkMode)} ${textField.className || ''}`}
            {...register(field.id, getValidationRules(field))}
        />
    );
};

const TextArea: React.FC<FieldProps> = ({ field, register, errors, isDarkMode }) => {
    const textareaField = field as TextareaField;
    return (
        <textarea
            id={field.id}
            rows={textareaField.rows || 5}
            cols={textareaField.cols}
            placeholder={textareaField.placeholder}
            disabled={textareaField.disabled}
            className={`${getFieldClasses(isDarkMode)} ${textareaField.className || ''} ${textareaField.resizable ? 'resize' : 'resize-none'}`}
            {...register(field.id, getValidationRules(field))}
        />
    );
};

const FileInput: React.FC<FieldProps> = ({ field, register, errors, isDarkMode }) => {
    const fileField = field as FileField;
    return (
        <input
            type="file"
            id={field.id}
            accept={fileField.accept}
            multiple={fileField.multiple}
            disabled={fileField.disabled}
            className={`${getFieldClasses(isDarkMode)} ${fileField.className || ''}`}
            {...register(field.id, getValidationRules(field))}
        />
    );
};

const SelectField: React.FC<FieldProps> = ({ field, register, errors, isDarkMode }) => {
    const selectField = field as SelectField;
    return (
        <select
            id={field.id}
            multiple={selectField.multiple}
            disabled={selectField.disabled}
            className={`${getFieldClasses(isDarkMode)} ${selectField.className || ''}`}
            {...register(field.id, getValidationRules(field))}
        >
            {selectField.options.map((option: any) => (
                <option key={option.value} value={option.value} disabled={option.disabled}>
                    {option.label}
                </option>
            ))}
        </select>
    );
};

const CheckboxField: React.FC<FieldProps> = ({ field, register, errors, isDarkMode }) => {
    const checkboxField = field as CheckboxField;

    if (checkboxField.options) {
        return (
            <div className="space-y-2">
                {checkboxField.options.map((option: any) => (
                    <label key={option.value} className="flex items-center space-x-2">
                        <input
                            type="checkbox"
                            value={option.value}
                            disabled={option.disabled || checkboxField.disabled}
                            className={`${getCheckboxClasses(isDarkMode)} ${checkboxField.className || ''}`}
                            {...register(field.id, getValidationRules(field))}
                        />
                        <span className={isDarkMode ? 'text-white' : 'text-black'}>{option.label}</span>
                    </label>
                ))}
            </div>
        );
    }

    return (
        <label className="flex items-center space-x-2">
            <input
                type="checkbox"
                disabled={checkboxField.disabled}
                checked={checkboxField.checked}
                className={`${getCheckboxClasses(isDarkMode)} ${checkboxField.className || ''}`}
                {...register(field.id, getValidationRules(field))}
            />
            <span className={isDarkMode ? 'text-white' : 'text-black'}>{field.label}</span>
        </label>
    );
};

const RadioField: React.FC<FieldProps> = ({ field, register, errors, isDarkMode }) => {
    const radioField = field as RadioField;
    return (
        <div className={`${radioField.inline ? 'flex space-x-4' : 'space-y-2'}`}>
            {radioField.options.map((option: any) => (
                <label key={option.value} className="flex items-center space-x-2">
                    <input
                        type="radio"
                        value={option.value}
                        disabled={option.disabled || radioField.disabled}
                        className={`${getRadioClasses(isDarkMode)} ${radioField.className || ''}`}
                        {...register(field.id, getValidationRules(field))}
                    />
                    <span className={isDarkMode ? 'text-white' : 'text-black'}>{option.label}</span>
                </label>
            ))}
        </div>
    );
};

const NumberField: React.FC<FieldProps> = ({ field, register, errors, isDarkMode }) => {
    const numberField = field as NumberField;
    return (
        <input
            type="number"
            id={field.id}
            min={numberField.min}
            max={numberField.max}
            step={numberField.step}
            disabled={numberField.disabled}
            placeholder={numberField.placeholder}
            className={`${getFieldClasses(isDarkMode)} ${numberField.className || ''}`}
            {...register(field.id, getValidationRules(field))}
        />
    );
};

const DateField: React.FC<FieldProps> = ({ field, register, errors, isDarkMode }) => {
    const dateField = field as DateField;
    return (
        <input
            type="date"
            id={field.id}
            min={dateField.minDate}
            max={dateField.maxDate}
            disabled={dateField.disabled}
            className={`${getFieldClasses(isDarkMode)} ${dateField.className || ''}`}
            {...register(field.id, getValidationRules(field))}
        />
    );
};

const getFieldClasses = (isDarkMode: boolean) => `
    w-full border rounded-lg p-2.5
    focus:outline-none focus:ring-2 focus:ring-[#EC5990] 
    transition-colors duration-200
    ${isDarkMode
        ? "bg-gray-800 border-gray-600 text-white placeholder-gray-400"
        : "bg-white border-gray-300 text-black placeholder-gray-500"
    }
`;

const getCheckboxClasses = (isDarkMode: boolean) => `
    h-4 w-4 rounded
    border-gray-300 text-[#EC5990] 
    focus:ring-[#EC5990]
    ${isDarkMode ? "bg-gray-800 border-gray-600" : "bg-white"}
`;

const getRadioClasses = (isDarkMode: boolean) => `
    h-4 w-4 rounded-full
    border-gray-300 text-[#EC5990]
    focus:ring-[#EC5990]
    ${isDarkMode ? "bg-gray-800 border-gray-600" : "bg-white"}
`;

const getValidationRules = (field: Field) => {
    const rules: any = {
        required: field.required,
    };

    if (field.validation) {
        if (field.validation.pattern) {
            rules.pattern = {
                value: new RegExp(field.validation.pattern),
                message: field.validation.message
            };
        }
        if (field.validation.min !== undefined) rules.min = field.validation.min;
        if (field.validation.max !== undefined) rules.max = field.validation.max;
        if (field.validation.minLength !== undefined) rules.minLength = field.validation.minLength;
        if (field.validation.maxLength !== undefined) rules.maxLength = field.validation.maxLength;
        if (field.validation.customValidator) {
            rules.validate = field.validation.customValidator;
        }
    }

    return rules;
};

const FormPreview: React.FC<FormPreviewProps> = ({ schema }) => {
    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm();
    const { isDarkMode } = useTheme();
    const [copied, setCopied] = useState(false);

    const handleCopyCode = () => {
        if (!schema) return;

        const generatedCode = `
            <form className="space-y-6">
                ${schema.fields.map((field) => {
                    if (field.type === "text" || field.type === "email") {
                        return `
                            <div className="space-y-2">
                                <label htmlFor="${field.id}" className="block font-medium">
                                    ${field.label}${field.required ? ' *' : ''}
                                </label>
                                <input 
                                    type="${field.type}"
                                    id="${field.id}"
                                    ${field.placeholder ? `placeholder="${field.placeholder}"` : ''}
                                    className="w-full border rounded-lg p-2.5 focus:outline-none focus:ring-2 focus:ring-[#EC5990]"
                                />
                            </div>
                        `;
                    }
                    if (field.type === "textarea") {
                        const textareaField = field as TextareaField;
                        return `
                            <div className="space-y-2">
                                <label htmlFor="${field.id}" className="block font-medium">
                                    ${field.label}${field.required ? ' *' : ''}
                                </label>
                                <textarea
                                    id="${field.id}"
                                    ${field.placeholder ? `placeholder="${field.placeholder}"` : ''}
                                    rows="${textareaField.rows || 5}"
                                    className="w-full border rounded-lg p-2.5 focus:outline-none focus:ring-2 focus:ring-[#EC5990]"
                                ></textarea>
                            </div>
                        `;
                    }
                    if (field.type === "select") {
                        const selectField = field as SelectField;
                        return `
                            <div className="space-y-2">
                                <label htmlFor="${field.id}" className="block font-medium">
                                    ${field.label}${field.required ? ' *' : ''}
                                </label>
                                <select
                                    id="${field.id}"
                                    className="w-full border rounded-lg p-2.5 focus:outline-none focus:ring-2 focus:ring-[#EC5990]"
                                >
                                    ${selectField.options.map(option =>
                                        `<option value="${option.value}">${option.label}</option>`
                                    ).join('\n')}
                                </select>
                            </div>
                        `;
                    }
                    return "";
                }).join("\n")}
            </form>
        `;

        navigator.clipboard.writeText(generatedCode)
            .then(() => {
                setCopied(true);
                setTimeout(() => setCopied(false), 2000);
            })
            .catch(() => alert("Failed to copy form code."));
    };

    const renderField = (field: Field) => {
        if (field.hidden) return null;

        const commonProps = {
            field,
            register,
            errors,
            isDarkMode,
        };

        switch (field.type) {
            case "text":
            case "email":
            case "password":
            case "tel":
            case "url":
                return <TextField {...commonProps} />;
            case "textarea":
                return <TextArea {...commonProps} />;
            case "file":
                return <FileInput {...commonProps} />;
            case "select":
                return <SelectField {...commonProps} />;
            case "checkbox":
                return <CheckboxField {...commonProps} />;
            case "radio":
                return <RadioField {...commonProps} />;
            case "number":
                return <NumberField {...commonProps} />;
            case "date":
                return <DateField {...commonProps} />;
            default:
                return <TextField {...commonProps} />;
        }
    };

    const onSubmit = async (data: any) => {
        try {
            if (schema?.onSubmit) {
                await schema.onSubmit(data);
            }
            console.log("Form Submitted", data);
            alert("Form submitted successfully!");
        } catch (error) {
            console.error("Form submission error:", error);
            alert("Form submission failed. Please try again.");
        }
    };

    const handleReset = () => {
        reset();
        schema?.onReset?.();
    };

    if (!schema) {
        return (
            <div className="p-6">
                <h2 className={`text-xl font-bold mb-4 ${isDarkMode ? "text-white" : "text-black"}`}>
                    Form Preview
                </h2>
                <div className="flex items-center space-x-2 p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                    <AlertCircle className="h-5 w-5 text-yellow-500" />
                    <p className="text-yellow-700 dark:text-yellow-400">
                        No valid schema available. Please provide a valid schema.
                    </p>
                </div>
            </div>
        );
    }

    const gridColumns = schema.layout?.columns || 1;
    const gridClass = {
        1: 'grid-cols-1',
        2: 'grid-cols-1 md:grid-cols-2',
        3: 'grid-cols-1 md:grid-cols-3',
        4: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4',
    }[gridColumns];

    const spacingClass = {
        compact: 'gap-4',
        normal: 'gap-6',
        relaxed: 'gap-8',
    }[schema.layout?.spacing || 'normal'];

    return (
        <div className={`p-6 ${schema.className || ''}`}>
            <div className="flex justify-between items-center mb-6">
                <h1 className={`text-xl font-bold ${isDarkMode ? "text-white" : "text-black"}`}>
                    {schema.formTitle}
                </h1>
                <button
                    onClick={handleCopyCode}
                    className="inline-flex items-center space-x-2 px-4 py-2 rounded-lg
                        bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600
                        text-gray-700 dark:text-gray-200
                        transition-colors duration-200
                        focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2
                        dark:focus:ring-offset-gray-800"
                >
                    {copied ? (
                        <CheckCircle className="h-5 w-5 text-green-500" />
                    ) : (
                        <Copy className="h-5 w-5" />
                    )}
                    <span>{copied ? 'Copied!' : 'Copy Code'}</span>
                </button>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700">
                {schema.formDescription && (
                    <p className="text-gray-600 dark:text-gray-300 mb-6">{schema.formDescription}</p>
                )}

                <form onSubmit={handleSubmit(onSubmit)} className={`grid ${gridClass} ${spacingClass}`}>
                    {schema.fields.map((field) => (
                        <div key={field.id} className="space-y-2">
                            {field.type !== 'checkbox' && (
                                <label
                                    htmlFor={field.id}
                                    className={`block font-medium ${isDarkMode ? "text-gray-200" : "text-gray-900"}`}
                                >
                                    {field.label}
                                    {field.required && <span className="text-red-500 ml-1">*</span>}
                                </label>
                            )}

                            {field.description && (
                                <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">
                                    {field.description}
                                </p>
                            )}

                            {renderField(field)}

                            {errors[field.id] && (
                                <p className="text-sm text-red-500 mt-1">
                                    {field.validation?.message || "This field is required"}
                                </p>
                            )}
                        </div>
                    ))}

                    <div className="col-span-full flex space-x-4 mt-6">
                        <button
                            type="submit"
                            className="flex-1 px-4 py-2 rounded-lg font-medium
                                bg-[#EC5990] text-white hover:bg-[#ea4b85]
                                transition-colors duration-200
                                focus:outline-none focus:ring-2 focus:ring-[#EC5990] focus:ring-offset-2
                                dark:focus:ring-offset-gray-800"
                        >
                            {schema.submitButtonText || 'Submit'}
                        </button>

                        {schema.showReset && (
                            <button
                                type="button"
                                onClick={handleReset}
                                className="px-4 py-2 rounded-lg font-medium
                                    bg-gray-200 text-gray-700 hover:bg-gray-300
                                    dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600
                                    transition-colors duration-200
                                    focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2
                                    dark:focus:ring-offset-gray-800"
                            >
                                {schema.resetButtonText || 'Reset'}
                            </button>
                        )}
                    </div>
                </form>
            </div>
        </div>
    );
};

export default React.memo(FormPreview);