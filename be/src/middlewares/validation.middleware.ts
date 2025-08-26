// [validation.middleware.ts]: Express-validator error handling middleware
import { Request, Response, NextFunction } from 'express';
import { validationResult } from 'express-validator';

// Handle validation errors from express-validator
export const handleValidationErrors = (req: Request, res: Response, next: NextFunction) => {
  console.log('Validation middleware called for:', req.method, req.path);
  const errors = validationResult(req);
  
  if (!errors.isEmpty()) {
    const errorMessages = errors.array().map(error => ({
      path: error.type === 'field' ? error.path : 'unknown',
      msg: error.msg
    }));
    
    console.log('Validation errors:', errorMessages);
    
    return res.status(400).json({
      message: 'Validation failed',
      errors: errorMessages
    });
  }
  
  next();
};