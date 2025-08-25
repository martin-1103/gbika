// [roles.middleware.ts]: Role-based authorization middleware
import { Request, Response, NextFunction } from 'express';

export const authorizeRoles = (...roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    // Log authorization attempt
    console.log('Authorization check - User:', req.user);

    if (!req.user) {
      console.log('Authorization failed - No user object');
      return res.status(401).json({ message: 'Unauthorized access.' });
    }

    if (!req.user.role) {
      console.log('Authorization failed - No role specified');
      return res.status(401).json({ message: 'Unauthorized access.' });
    }

    if (!roles.includes(req.user.role)) {
      console.log(`Authorization failed - Role ${req.user.role} not in`, roles);
      return res.status(403).json({ message: 'Forbidden access.' });
    }

    console.log(`Authorization successful - Role ${req.user.role} authorized for`, roles);
    next();
  };
};