import { validateEmail, validatePassword, validateRegistrationInput, validateLoginInput, sanitizeInput } from '@/lib/validation';

describe('Validation Utils', () => {
  describe('validateEmail', () => {
    it('should return true for valid email', () => {
      expect(validateEmail('test@example.com')).toBe(true);
      expect(validateEmail('user.name@domain.co.uk')).toBe(true);
    });

    it('should return false for invalid email', () => {
      expect(validateEmail('invalid')).toBe(false);
      expect(validateEmail('invalid@')).toBe(false);
      expect(validateEmail('@domain.com')).toBe(false);
      expect(validateEmail('')).toBe(false);
    });
  });

  describe('validatePassword', () => {
    it('should return valid for password >= 6 chars', () => {
      const result = validatePassword('password123');
      expect(result.valid).toBe(true);
    });

    it('should return invalid for password < 6 chars', () => {
      const result = validatePassword('12345');
      expect(result.valid).toBe(false);
      expect(result.message).toBe('Password must be at least 6 characters');
    });
  });

  describe('validateRegistrationInput', () => {
    it('should return valid for correct input', () => {
      const result = validateRegistrationInput({
        name: 'John Doe',
        email: 'john@example.com',
        password: 'password123',
      });
      expect(result.valid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should return errors for invalid input', () => {
      const result = validateRegistrationInput({
        name: 'J',
        email: 'invalid',
        password: '123',
      });
      expect(result.valid).toBe(false);
      expect(result.errors.length).toBeGreaterThan(0);
    });
  });

  describe('validateLoginInput', () => {
    it('should return valid for correct input', () => {
      const result = validateLoginInput({
        email: 'john@example.com',
        password: 'password123',
      });
      expect(result.valid).toBe(true);
    });

    it('should return errors for missing email', () => {
      const result = validateLoginInput({
        email: 'invalid',
        password: 'password',
      });
      expect(result.valid).toBe(false);
    });
  });

  describe('sanitizeInput', () => {
    it('should trim whitespace', () => {
      expect(sanitizeInput('  hello  ')).toBe('hello');
    });

    it('should remove dangerous characters', () => {
      expect(sanitizeInput('<script>alert(1)</script>')).toBe('scriptalert(1)/script');
    });
  });
});
