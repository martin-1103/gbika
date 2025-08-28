// [user.controller.ts]: User management HTTP request handlers
import { Request, Response, NextFunction } from 'express';
import { findAllUsers, findOneUserById, createNewUser, updateUserById, softDeleteUser } from '../services/user.service';

// List all users with pagination
export const listUsers = async (req: Request, res: Response, next: NextFunction) => {
  try {
    console.log('=== ENTERING listUsers controller ===');
    console.log('List users request:', { query: req.query, user: req.user });

    const {
      page = 1,
      limit = 10,
      search = '',
      role = ''
    } = req.query;

    const params = {
      page: parseInt(page as string, 10),
      limit: parseInt(limit as string, 10),
      search: search as string,
      role: role as string
    };

    const result = await findAllUsers(params);

    console.log('List users result:', {
      total: result.meta.total,
      page: result.meta.page,
      totalPages: result.meta.totalPages
    });

    res.status(200).json({
      success: true,
      data: result.data,
      meta: result.meta,
      message: 'Users retrieved successfully'
    });
  } catch (error) {
    console.error('Error in listUsers:', error);
    next(error);
  }
};

// Get user by ID
export const findUserById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    console.log('=== ENTERING findUserById controller ===');
    console.log('Get user by ID request:', { params: req.params });

    const { id } = req.params;

    if (!id) {
      return res.status(400).json({
        success: false,
        message: 'User ID is required.'
      });
    }

    const user = await findOneUserById(id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found.'
      });
    }

    console.log('Get user by ID result:', { id, found: !!user });

    res.status(200).json({
      success: true,
      data: user,
      message: 'User retrieved successfully'
    });
  } catch (error) {
    console.error('Error in findUserById:', error);
    next(error);
  }
};

// Create new user
export const createUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    console.log('=== ENTERING createUser controller ===');
    console.log('Create user request:', { body: req.body, user: req.user });

    const { name, email, password, role } = req.body;

    if (!name || !email || !password || !role) {
      return res.status(400).json({
        success: false,
        message: 'Name, email, password, and role are required'
      });
    }

    const user = await createNewUser({ name, email, password, role });

    console.log('Create user result:', { id: user.id, email: user.email });

    res.status(201).json({
      success: true,
      data: user,
      message: 'User created successfully'
    });
  } catch (error: any) {
    console.error('Error in createUser:', error);

    if (error.message === 'User with this email already exists') {
      return res.status(409).json({
        success: false,
        message: error.message
      });
    }

    next(error);
  }
};

// Update user
export const updateUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    console.log('=== ENTERING updateUser controller ===');
    console.log('Update user request:', { params: req.params, body: req.body, user: req.user });

    const { id } = req.params;
    const { name, email, role } = req.body;

    if (!id) {
      return res.status(400).json({
        success: false,
        message: 'User ID is required.'
      });
    }

    const updatedUser = await updateUserById(id, { name, email, role });

    console.log('Update user result:', { id: updatedUser.id, email: updatedUser.email });

    res.status(200).json({
      success: true,
      data: updatedUser,
      message: 'User updated successfully'
    });
  } catch (error: any) {
    console.error('Error in updateUser:', error);

    if (error.message === 'User not found') {
      return res.status(404).json({
        success: false,
        message: error.message
      });
    }

    if (error.message === 'User with this email already exists') {
      return res.status(409).json({
        success: false,
        message: error.message
      });
    }

    next(error);
  }
};

// Delete user
export const deleteUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    console.log('=== ENTERING deleteUser controller ===');
    console.log('Delete user request:', { params: req.params, user: req.user });

    const { id } = req.params;

    if (!id) {
      return res.status(400).json({
        success: false,
        message: 'User ID is required.'
      });
    }

    // Prevent self-deletion
    if (req.user?.sub === id) {
      return res.status(400).json({
        success: false,
        message: 'Cannot delete your own account'
      });
    }

    const result = await softDeleteUser(id);

    if (!result) {
      return res.status(404).json({
        success: false,
        message: 'User not found.'
      });
    }

    console.log('Delete user result:', { id, success: result });

    res.status(204).send();
  } catch (error) {
    console.error('Error in deleteUser:', error);
    next(error);
  }
};