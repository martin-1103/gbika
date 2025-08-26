export declare const createPrayerRequest: (data: {
    name: string;
    contact: string;
    content: string;
    isAnonymous: boolean;
}) => Promise<{
    id: string;
    name: string;
    createdAt: Date;
    updatedAt: Date;
    content: string;
    contact: string;
    isAnonymous: boolean;
}>;
//# sourceMappingURL=prayer.service.d.ts.map