// [auth.controller.ts]: Auth HTTP request handlers
import { Request, Response, NextFunction } from 'express';
import { validationResult } from 'express-validator';
import { loginUser, generateToken, blacklistToken } from '../services/auth.service';
import { findUserById } from '../services/user.service';

export const login = async (req: Request, res: Response, next: NextFunction) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  }

  const { email, password } = req.body;

  try {
    const user = await loginUser(email, password);

    if (!user) {
      return res.status(401).json({ message: 'Email atau password salah.' });
    }

    const accessToken = generateToken(user);

    res.status(200).json({
      accessToken,
      user: {
        id: user.id,
        name: user.name,
        role: user.role,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const logout = async (req: Request, res: Response, next: NextFunction) => {
 const authHeader = req.headers['authorization'];
 const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

 if (!token) {
   return res.status(401).json({ message: 'Access token required.' });
 }

 try {
   const success = await blacklistToken(token);

   if (!success) {
     return res.status(500).json({ message: 'Failed to logout.' });
   }

   res.status(200).json({
     message: 'Logout berhasil.',
   });
 } catch (error) {
   next(error);
 }
};

// Get current user profile from authenticated token
export const getProfile = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // user is guaranteed to exist here due to authenticateToken middleware
    if (!req.user || !req.user.sub) {
      return res.status(401).json({ message: 'Authentication required.' });
    }

    const userId = req.user.sub;
    
    // Retrieve user data without sensitive fields
    const user = await findUserById(userId);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    // Return filtered user profile data
    res.status(200).json({
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    });
  } catch (error) {
    console.error('Error retrieving user profile:', error);
    next(error);
  }
};
