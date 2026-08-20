'use client';

import { useState, useCallback, ChangeEvent } from 'react';

interface ValidationRule {
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  pattern?: RegExp;
  custom?: (_value: any) => boolean | string;
  message?: string;
}

type ValidationRules<T> = Partial<Record<keyof T, ValidationRule>>;
type Errors<T> = Partial<Record<keyof T, string>>;

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
      if (!validationRules || !validationRules[name]) {
        return undefined;
      }

      const rules = validationRules[name]!;

      if (rules.required && (!value || (typeof value === 'string' && !value.trim()))) {
        return rules.message || 'Este campo es requerido';
      }

      if (rules.minLength && typeof value === 'string' && value.length < rules.minLength) {
        return rules.message || `Mínimo ${rules.minLength} caracteres`;
      }

      if (rules.maxLength && typeof value === 'string' && value.length > rules.maxLength) {
        return rules.message || `Máximo ${rules.maxLength} caracteres`;
      }

      if (rules.pattern && typeof value === 'string' && !rules.pattern.test(value)) {
        return rules.message || 'Formato inválido';
      }

      if (rules.custom) {
        const customResult = rules.custom(value);
        if (typeof customResult === 'string') {
          return customResult;
        }
        if (!customResult) {
          return rules.message || 'Valor inválido';
        }
      }

      return undefined;
    },
    [validationRules]
  );

  const handleChange = useCallback(
    (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
      const { name, value, type } = e.target;
      const checked = (e.target as HTMLInputElement).checked;

      const fieldValue = type === 'checkbox' ? checked : value;

      setValues(prev => ({
        ...prev,
        [name]: fieldValue,
      }));

      // Validar en tiempo real si ya fue tocado
      if (touched.has(name as keyof T)) {
        const error = validateField(name as keyof T, fieldValue);
        setErrors(prev => ({
          ...prev,
          [name]: error,
        }));
      }
    },
    [touched, validateField]
  );

  const handleBlur = useCallback(
    (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
      const { name, value } = e.target;
      setTouched(prev => new Set(prev).add(name as keyof T));

      const error = validateField(name as keyof T, value);
      setErrors(prev => ({
        ...prev,
        [name]: error,
      }));
    },
    [validateField]
  );

  const validateForm = useCallback((): boolean => {
    if (!validationRules) return true;

    const newErrors: Errors<T> = {};
    let isValid = true;

    (Object.keys(validationRules) as Array<keyof T>).forEach(key => {
      const error = validateField(key, values[key]);
      if (error) {
        newErrors[key] = error;
        isValid = false;
      }
    });

    setErrors(newErrors);
    setTouched(new Set(Object.keys(values) as Array<keyof T>));
    return isValid;
  }, [values, validateField, validationRules]);

  const handleSubmit = useCallback(
    async (
      e: React.FormEvent,
      onSubmit: (_values: T) => Promise<void> | void
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