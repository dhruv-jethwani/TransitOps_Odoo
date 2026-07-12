import { z } from 'zod';

/**
 * Clean Validation Schemas for TransitOps Client Console
 */

// Login Validation Schema
export const loginSchema = z.object({
  email: z
    .string()
    .min(1, 'Email address is required')
    .email('Please enter a valid corporate email format (e.g., name@transitops.com)'),
  password: z
    .string()
    .min(6, 'Access key must be at least 6 characters long'),
});

// Registration Validation Schema (Optional but recommended for consistency)
export const registerSchema = z.object({
  name: z
    .string()
    .min(2, 'Full name must be at least 2 characters'),
  email: z
    .string()
    .min(1, 'Email address is required')
    .email('Invalid corporate email format'),
  password: z
    .string()
    .min(6, 'Password must be at least 6 characters long'),
  confirmPassword: z
    .string()
    .min(1, 'Please confirm your access key'),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Access keys do not match",
  path: ["confirmPassword"],
});