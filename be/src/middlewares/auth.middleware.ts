// [auth.middleware.ts]: JWT token authentication middleware
import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { isTokenBlacklisted } from '../services/auth.service';

// Extend Request interface to include user
declare global {
  namespace Express {
    interface Request {
      user?: {
        sub: string;
        role: string;
        jti: string;
        iat: number;
        exp: number;
      };
    }
  }
}

export const authenticateToken = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

    if (!token) {
      return res.status(401).json({ message: 'Access token required.' });
    }

    // Check if token is blacklisted
    const isBlacklisted = await isTokenBlacklisted(token);
    if (isBlacklisted) {
      return res.status(401).json({ message: 'Token has been revoked.' });
    }

    // Check if JWT secret exists
    if (!process.env.JWT_SECRET) {
      console.error('JWT_SECRET is not set');
      return res.status(500).json({ message: 'Server configuration error.' });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET) as {
      sub: string;
      role: string;
      jti: string;
      iat: number;
      exp: number;
    };

    // Set user info in request
    req.user = decoded;
    
    // Log authentication success
    console.log(`User authenticated - Role: ${decoded.role}, ID: ${decoded.sub}`);
    
    next();
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      return res.status(401).json({ message: 'Token has expired.' });
    }
    if (error instanceof jwt.JsonWebTokenError) {
      return res.status(401).json({ message: 'Invalid token.' });
    }
    console.error('Authentication error:', error);
    next(error);
  }
};