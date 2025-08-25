// [auth.validator.ts]: Auth request validators
import { body } from 'express-validator';

export const loginValidator = [
  body('email').isEmail().withMessage('Email must be a valid email address'),
  body('password').notEmpty().withMessage('Password is required'),
];
