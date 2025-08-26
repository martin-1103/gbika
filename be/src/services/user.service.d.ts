export declare const findUserByEmail: (email: string) => Promise<{
    id: string;
    email: string;
    password: string;
    name: string;
    role: string;
    createdAt: Date;
    updatedAt: Date;
} | null>;
export declare const findUserById: (id: string) => Promise<{
    id: string;
    email: string;
    name: string;
    role: string;
    createdAt: Date;
    updatedAt: Date;
} | null>;
//# sourceMappingURL=user.service.d.ts.map