// [user.routes.ts]: User management routes
import { Router } from 'express';
import { listUsers, findUserById, createUser, updateUser, deleteUser } from '../controllers/user.controller';
import { authenticateToken } from '../middlewares/auth.middleware';
import { authorizeRoles } from '../middlewares/roles.middleware';

const userRouter = Router();

// All user routes require admin authentication
userRouter.use(authenticateToken);
userRouter.use(authorizeRoles('admin'));

// GET /users - List all users
userRouter.get('/', listUsers);

// GET /users/:id - Get user by ID
userRouter.get('/:id', findUserById);

// POST /users - Create new user
userRouter.post('/', createUser);

// PUT /users/:id - Update user
userRouter.put('/:id', updateUser);

// DELETE /users/:id - Delete user
userRouter.delete('/:id', deleteUser);

export { userRouter };