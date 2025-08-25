// [user.service.ts]: User database operations
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const findUserByEmail = async (email: string) => {
  return await prisma.user.findUnique({
    where: {
      email,
    },
  });
};

// Find user by ID and return safe profile data (excluding sensitive fields)
export const findUserById = async (id: string) => {
  const user = await prisma.user.findUnique({
    where: {
      id,
    },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      createdAt: true,
      updatedAt: true,
      // Explicitly exclude password field for security
    },
  });
  
  return user;
};
