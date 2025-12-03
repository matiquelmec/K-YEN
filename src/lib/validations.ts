// Validaciones robustas para formularios y datos

// Validación de email
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Validación de RUT chileno
export const isValidRUT = (rut: string): boolean => {
  if (!rut) return false;

  // Limpiar RUT
  const cleanRUT = rut.replace(/[.-]/g, '').toUpperCase();

  if (!/^\d{7,8}[0-9K]$/.test(cleanRUT)) return false;

  const body = cleanRUT.slice(0, -1);
  const dv = cleanRUT.slice(-1);

  let sum = 0;
  let multiplier = 2;

  for (let i = body.length - 1; i >= 0; i--) {
    sum += parseInt(body[i] || '0') * multiplier;
    multiplier = multiplier === 7 ? 2 : multiplier + 1;
  }

  const expectedDV = 11 - (sum % 11);
  const calculatedDV = expectedDV === 11 ? '0' : expectedDV === 10 ? 'K' : String(expectedDV);

  return dv === calculatedDV;
};

// Validación de teléfono chileno
export const isValidPhoneNumber = (phone: string): boolean => {
  const cleanPhone = phone.replace(/[\s()-]/g, '');
  const phoneRegex = /^(\+56)?9\d{8}$/;
  return phoneRegex.test(cleanPhone);
};

// Validación de contraseña segura
export const isStrongPassword = (password: string): {
  isValid: boolean;
  errors: string[]
} => {
  const errors: string[] = [];

  if (password.length < 8) {
    errors.push('La contraseña debe tener al menos 8 caracteres');
  }

  if (!/[A-Z]/.test(password)) {
    errors.push('Debe contener al menos una letra mayúscula');
  }

  if (!/[a-z]/.test(password)) {
    errors.push('Debe contener al menos una letra minúscula');
  }

  if (!/\d/.test(password)) {
    errors.push('Debe contener al menos un número');
  }

  if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    errors.push('Debe contener al menos un carácter especial');
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};

// Validación de tarjeta de crédito (algoritmo de Luhn)
export const isValidCreditCard = (cardNumber: string): boolean => {
  const cleanNumber = cardNumber.replace(/\s/g, '');

  if (!/^\d{13,19}$/.test(cleanNumber)) return false;

  let sum = 0;
  let isEven = false;

  for (let i = cleanNumber.length - 1; i >= 0; i--) {
    let digit = parseInt(cleanNumber[i] || '0');

    if (isEven) {
      digit *= 2;
      if (digit > 9) {
        digit -= 9;
      }
    }

    sum += digit;
    isEven = !isEven;
  }

  return sum % 10 === 0;
};

// Tipo de tarjeta de crédito
export const getCreditCardType = (cardNumber: string): string | null => {
  const cleanNumber = cardNumber.replace(/\s/g, '');

  const patterns = {
    visa: /^4[0-9]{12}(?:[0-9]{3})?$/,
    mastercard: /^5[1-5][0-9]{14}$/,
    amex: /^3[47][0-9]{13}$/,
    discover: /^6(?:011|5[0-9]{2})[0-9]{12}$/,
  };

  for (const [type, pattern] of Object.entries(patterns)) {
    if (pattern.test(cleanNumber)) {
      return type;
    }
  }

  return null;
};

// Validación de código postal chileno
export const isValidPostalCode = (postalCode: string): boolean => {
  const cleanCode = postalCode.replace(/\s/g, '');
  return /^\d{7}$/.test(cleanCode);
};

// Validación de fecha de nacimiento (mayor de edad)
export const isAdult = (birthDate: Date): boolean => {
  const today = new Date();
  const birth = new Date(birthDate);

  let age = today.getFullYear() - birth.getFullYear();
  const monthDiff = today.getMonth() - birth.getMonth();

  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
    age--;
  }

  return age >= 18;
};

// Validación de cantidad de producto
export const isValidQuantity = (quantity: number, max: number = 99): boolean => {
  return quantity > 0 && quantity <= max && Number.isInteger(quantity);
};

// Validación de precio
export const isValidPrice = (price: number): boolean => {
  return price > 0 && Number.isFinite(price);
};

// Sanitización de entrada de texto
export const sanitizeInput = (input: string): string => {
  return input
    .trim()
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/<[^>]+>/g, '');
};

// Validación de URL
export const isValidURL = (url: string): boolean => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

// Validación de formato de imagen
export const isValidImageFormat = (filename: string): boolean => {
  const validFormats = ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg'];
  const extension = filename.split('.').pop()?.toLowerCase();
  return extension ? validFormats.includes(extension) : false;
};

// Validación de tamaño de archivo (en bytes)
export const isValidFileSize = (size: number, maxSizeMB: number = 5): boolean => {
  const maxSizeBytes = maxSizeMB * 1024 * 1024;
  return size > 0 && size <= maxSizeBytes;
};

// Validación de formulario genérica
export interface ValidationRule {
  type: 'required' | 'email' | 'phone' | 'rut' | 'minLength' | 'maxLength' | 'custom';
  value?: any;
  message: string;
  validator?: (value: any) => boolean;
}

export const validateField = (
  value: any,
  rules: ValidationRule[]
): { isValid: boolean; errors: string[] } => {
  const errors: string[] = [];

  for (const rule of rules) {
    switch (rule.type) {
      case 'required':
        if (!value || (typeof value === 'string' && !value.trim())) {
          errors.push(rule.message);
        }
        break;

      case 'email':
        if (value && !isValidEmail(value)) {
          errors.push(rule.message);
        }
        break;

      case 'phone':
        if (value && !isValidPhoneNumber(value)) {
          errors.push(rule.message);
        }
        break;

      case 'rut':
        if (value && !isValidRUT(value)) {
          errors.push(rule.message);
        }
        break;

      case 'minLength':
        if (value && value.length < rule.value) {
          errors.push(rule.message);
        }
        break;

      case 'maxLength':
        if (value && value.length > rule.value) {
          errors.push(rule.message);
        }
        break;

      case 'custom':
        if (rule.validator && !rule.validator(value)) {
          errors.push(rule.message);
        }
        break;
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};