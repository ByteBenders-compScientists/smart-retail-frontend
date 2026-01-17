import { validateEmail, validatePhone } from './utils';

export interface ValidationError {
  field: string;
  message: string;
}

export interface ValidationResult {
  isValid: boolean;
  errors: ValidationError[];
}

/**
 * Validate registration form
 */
export function validateRegistrationForm(data: {
  name: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
}): ValidationResult {
  const errors: ValidationError[] = [];

  // Name validation
  if (!data.name || data.name.trim().length < 2) {
    errors.push({ field: 'name', message: 'Name must be at least 2 characters' });
  }

  // Email validation
  if (!data.email || !validateEmail(data.email)) {
    errors.push({ field: 'email', message: 'Please enter a valid email address' });
  }

  // Phone validation
  if (!data.phone || !validatePhone(data.phone)) {
    errors.push({ field: 'phone', message: 'Please enter a valid Kenyan phone number' });
  }

  // Password validation
  if (!data.password || data.password.length < 6) {
    errors.push({ field: 'password', message: 'Password must be at least 6 characters' });
  }

  // Confirm password validation
  if (data.password !== data.confirmPassword) {
    errors.push({ field: 'confirmPassword', message: 'Passwords do not match' });
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

/**
 * Validate login form
 */
export function validateLoginForm(data: {
  email: string;
  password: string;
}): ValidationResult {
  const errors: ValidationError[] = [];

  // Email validation
  if (!data.email || !validateEmail(data.email)) {
    errors.push({ field: 'email', message: 'Please enter a valid email address' });
  }

  // Password validation
  if (!data.password || data.password.length < 1) {
    errors.push({ field: 'password', message: 'Password is required' });
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

/**
 * Validate checkout form
 */
export function validateCheckoutForm(data: {
  phone: string;
}): ValidationResult {
  const errors: ValidationError[] = [];

  // Phone validation
  if (!data.phone || !validatePhone(data.phone)) {
    errors.push({ field: 'phone', message: 'Please enter a valid M-Pesa phone number' });
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

/**
 * Get error message for a specific field
 */
export function getFieldError(errors: ValidationError[], field: string): string | undefined {
  return errors.find(error => error.field === field)?.message;
}