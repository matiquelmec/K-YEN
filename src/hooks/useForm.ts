'use client';

import { useState, useCallback, ChangeEvent } from 'react';

interface ValidationRule {
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  pattern?: RegExp;
  custom?: (value: any) => boolean | string;
  message?: string;
}

type ValidationRules<T> = {
  [K in keyof T]?: ValidationRule;
};

type Errors<T> = {
  [K in keyof T]?: string;
};

export function useForm<T extends Record<string, any>>(
  initialValues: T,
  validationRules?: ValidationRules<T>
) {
  const [values, setValues] = useState<T>(initialValues);
  const [errors, setErrors] = useState<Errors<T>>({});
  const [touched, setTouched] = useState<Set<keyof T>>(new Set());
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateField = useCallback(
    (name: keyof T, value: any): string | undefined => {
      const rules = validationRules?.[name];
      if (!rules) return undefined;

      if (rules.required && !value) {
        return rules.message || 'Este campo es requerido';
      }

      if (rules.minLength && value.length < rules.minLength) {
        return rules.message || `Mínimo ${rules.minLength} caracteres`;
      }

      if (rules.maxLength && value.length > rules.maxLength) {
        return rules.message || `Máximo ${rules.maxLength} caracteres`;
      }

      if (rules.pattern && !rules.pattern.test(value)) {
        return rules.message || 'Formato inválido';
      }

      if (rules.custom) {
        const result = rules.custom(value);
        if (typeof result === 'string') return result;
        if (!result) return rules.message || 'Validación falló';
      }

      return undefined;
    },
    [validationRules]
  );

  const handleChange = useCallback(
    (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
      const { name, value, type } = e.target;
      const fieldName = name as keyof T;

      let fieldValue: any = value;
      if (type === 'checkbox') {
        fieldValue = (e.target as HTMLInputElement).checked;
      } else if (type === 'number') {
        fieldValue = parseFloat(value) || 0;
      }

      setValues(prev => ({
        ...prev,
        [fieldName]: fieldValue,
      }));

      // Validar campo si ya fue tocado
      if (touched.has(fieldName)) {
        const error = validateField(fieldName, fieldValue);
        setErrors(prev => ({
          ...prev,
          [fieldName]: error,
        }));
      }
    },
    [touched, validateField]
  );

  const handleBlur = useCallback(
    (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
      const fieldName = e.target.name as keyof T;

      setTouched(prev => new Set(prev).add(fieldName));

      const error = validateField(fieldName, values[fieldName]);
      setErrors(prev => ({
        ...prev,
        [fieldName]: error,
      }));
    },
    [values, validateField]
  );

  const validateForm = useCallback((): boolean => {
    const newErrors: Errors<T> = {};
    let isValid = true;

    Object.keys(values).forEach(key => {
      const fieldName = key as keyof T;
      const error = validateField(fieldName, values[fieldName]);
      if (error) {
        newErrors[fieldName] = error;
        isValid = false;
      }
    });

    setErrors(newErrors);
    setTouched(new Set(Object.keys(values) as Array<keyof T>));
    return isValid;
  }, [values, validateField]);

  const handleSubmit = useCallback(
    async (
      e: React.FormEvent,
      onSubmit: (values: T) => Promise<void> | void
    ) => {
      e.preventDefault();

      if (!validateForm()) {
        return;
      }

      setIsSubmitting(true);
      try {
        await onSubmit(values);
        // Resetear formulario después de envío exitoso
        setValues(initialValues);
        setErrors({});
        setTouched(new Set());
      } catch (error) {
        console.error('Error submitting form:', error);
      } finally {
        setIsSubmitting(false);
      }
    },
    [values, initialValues, validateForm]
  );

  const reset = useCallback(() => {
    setValues(initialValues);
    setErrors({});
    setTouched(new Set());
    setIsSubmitting(false);
  }, [initialValues]);

  const setFieldValue = useCallback(<K extends keyof T>(name: K, value: T[K]) => {
    setValues(prev => ({
      ...prev,
      [name]: value,
    }));

    if (touched.has(name)) {
      const error = validateField(name, value);
      setErrors(prev => ({
        ...prev,
        [name]: error,
      }));
    }
  }, [touched, validateField]);

  return {
    values,
    errors,
    touched,
    isSubmitting,
    handleChange,
    handleBlur,
    handleSubmit,
    reset,
    setFieldValue,
    validateForm,
    isValid: Object.keys(errors).length === 0,
  };
}