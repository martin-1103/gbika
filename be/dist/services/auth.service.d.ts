import { User } from '@prisma/client';
export declare const closeRedisConnection: () => Promise<void>;
export declare const loginUser: (email: string, password: string) => Promise<{
    id: string;
    email: string;
    password: string;
    name: string;
    role: string;
    createdAt: Date;
    updatedAt: Date;
} | null>;
export declare const generateToken: (user: User) => string;
export declare const blacklistToken: (token: string) => Promise<boolean>;
export declare const isTokenBlacklisted: (token: string) => Promise<boolean>;
//# sourceMappingURL=auth.service.d.ts.map