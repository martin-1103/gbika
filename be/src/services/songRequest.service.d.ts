export declare const createSongRequest: (data: {
    name: string;
    city?: string;
    songTitle: string;
    message?: string;
}) => Promise<{
    id: string;
    name: string;
    createdAt: Date;
    updatedAt: Date;
    message: string | null;
    city: string | null;
    songTitle: string;
}>;
export declare const getRecentSongRequests: (limit?: number) => Promise<{
    id: string;
    name: string;
    createdAt: Date;
    updatedAt: Date;
    message: string | null;
    city: string | null;
    songTitle: string;
}[]>;
//# sourceMappingURL=songRequest.service.d.ts.map