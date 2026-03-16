export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

export function validatePassword(password: string): { valid: boolean; message?: string } {
  if (password.length < 6) {
    return { valid: false, message: 'Password must be at least 6 characters' };
  }
  return { valid: true };
}

export function sanitizeInput(input: string): string {
  return input.trim().replace(/[<>]/g, '');
}

export function validateRegistrationInput(data: {
  name?: string;
  email?: string;
  password?: string;
}): { valid: boolean; errors: string[] } {
  const errors: string[] = [];
  
  if (!data.name || data.name.trim().length < 2) {
    errors.push('Name must be at least 2 characters');
  }
  
  if (!data.email || !validateEmail(data.email)) {
    errors.push('Valid email is required');
  }
  
  const passwordValidation = validatePassword(data.password || '');
  if (!passwordValidation.valid) {
    errors.push(passwordValidation.message!);
  }
  
  return { valid: errors.length === 0, errors };
}

export function validateLoginInput(data: {
  email?: string;
  password?: string;
}): { valid: boolean; errors: string[] } {
  const errors: string[] = [];
  
  if (!data.email || !validateEmail(data.email)) {
    errors.push('Valid email is required');
  }
  
  if (!data.password) {
    errors.push('Password is required');
  }
  
  return { valid: errors.length === 0, errors };
}
