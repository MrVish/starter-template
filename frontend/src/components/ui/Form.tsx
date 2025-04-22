import { FormControl, FormLabel, Input, Textarea, Select, FormErrorMessage, Button, VStack, Box, useColorModeValue } from '@chakra-ui/react';
import { useState, ReactNode, FormEvent } from 'react';

interface FormFieldBase {
  id: string;
  label: string;
  required?: boolean;
  placeholder?: string;
  helperText?: string;
}

interface InputField extends FormFieldBase {
  type: 'text' | 'email' | 'password' | 'number' | 'date';
}

interface TextareaField extends FormFieldBase {
  type: 'textarea';
  rows?: number;
}

interface SelectField extends FormFieldBase {
  type: 'select';
  options: Array<{ value: string; label: string }>;
}

type FormField = InputField | TextareaField | SelectField;

interface FormProps {
  fields: FormField[];
  onSubmit: (values: Record<string, string>) => void;
  submitText?: string;
  isLoading?: boolean;
  defaultValues?: Record<string, string>;
  glassMorphism?: boolean;
}

export const GlassForm = ({ 
  fields, 
  onSubmit, 
  submitText = 'Submit', 
  isLoading = false,
  defaultValues = {},
  glassMorphism = false
}: FormProps) => {
  const [values, setValues] = useState<Record<string, string>>(() => {
    // Initialize with default values if provided
    return { ...defaultValues };
  });
  
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  const validateField = (field: FormField, value: string): string => {
    if (field.required && !value) {
      return `${field.label} is required`;
    }
    
    if (field.type === 'email' && value) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(value)) {
        return 'Please enter a valid email address';
      }
    }
    
    return '';
  };
  
  const handleChange = (id: string, value: string, field: FormField) => {
    setValues((prev) => ({ ...prev, [id]: value }));
    
    // Validate on change
    const error = validateField(field, value);
    setErrors((prev) => ({
      ...prev,
      [id]: error,
    }));
  };
  
  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    
    // Validate all fields
    const newErrors: Record<string, string> = {};
    let hasErrors = false;
    
    fields.forEach((field) => {
      const value = values[field.id] || '';
      const error = validateField(field, value);
      if (error) {
        newErrors[field.id] = error;
        hasErrors = true;
      }
    });
    
    setErrors(newErrors);
    
    if (!hasErrors) {
      onSubmit(values);
    }
  };
  
  const renderField = (field: FormField): ReactNode => {
    const value = values[field.id] || '';
    const error = errors[field.id] || '';
    
    return (
      <FormControl key={field.id} isInvalid={!!error} mb={4} isRequired={field.required}>
        <FormLabel htmlFor={field.id}>{field.label}</FormLabel>
        
        {field.type === 'textarea' ? (
          <Textarea
            id={field.id}
            value={value}
            onChange={(e) => handleChange(field.id, e.target.value, field)}
            placeholder={field.placeholder}
            rows={(field as TextareaField).rows || 3}
          />
        ) : field.type === 'select' ? (
          <Select
            id={field.id}
            value={value}
            onChange={(e) => handleChange(field.id, e.target.value, field)}
            placeholder={field.placeholder}
          >
            {(field as SelectField).options.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </Select>
        ) : (
          <Input
            id={field.id}
            type={field.type}
            value={value}
            onChange={(e) => handleChange(field.id, e.target.value, field)}
            placeholder={field.placeholder}
          />
        )}
        
        {error && <FormErrorMessage>{error}</FormErrorMessage>}
      </FormControl>
    );
  };
  
  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  
  const formStyles = glassMorphism ? {
    background: 'rgba(255, 255, 255, 0.7)',
    backdropFilter: 'blur(10px)',
    borderRadius: '1rem',
    border: '1px solid rgba(255, 255, 255, 0.2)',
    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
    padding: 6,
  } : {
    background: bgColor,
    borderRadius: 'md',
    border: '1px solid',
    borderColor: borderColor,
    padding: 6,
  };
  
  return (
    <Box as="form" onSubmit={handleSubmit} {...formStyles}>
      <VStack spacing={4} align="flex-start">
        {fields.map(renderField)}
        <Button
          type="submit"
          colorScheme="blue"
          isLoading={isLoading}
          width="full"
          mt={4}
        >
          {submitText}
        </Button>
      </VStack>
    </Box>
  );
};

// Usage example:
/*
import { GlassForm } from '@/components/ui/Form';
import { useToast } from '@/components/ui/Toast';

const ContactForm = () => {
  const toast = useToast();
  
  const handleSubmit = (values) => {
    console.log(values);
    toast.success('Form submitted', 'We will get back to you soon!');
  };
  
  const fields = [
    { id: 'name', label: 'Full Name', type: 'text', required: true },
    { id: 'email', label: 'Email', type: 'email', required: true },
    { id: 'subject', label: 'Subject', type: 'select', required: true, 
      options: [
        { value: 'general', label: 'General Inquiry' },
        { value: 'support', label: 'Technical Support' },
        { value: 'feedback', label: 'Feedback' }
      ]
    },
    { id: 'message', label: 'Message', type: 'textarea', required: true }
  ];
  
  return (
    <GlassForm 
      fields={fields} 
      onSubmit={handleSubmit} 
      submitText="Send Message"
      glassMorphism={true}
    />
  );
};
*/ 