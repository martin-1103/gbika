interface PaginationOptions {
    page?: number;
    limit?: number;
}
interface TestimonialListResult {
    data: any[];
    meta: {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
        hasNext: boolean;
        hasPrev: boolean;
    };
}
export declare const findAllApproved: (options?: PaginationOptions) => Promise<TestimonialListResult>;
export declare const createTestimonial: (data: {
    name: string;
    email: string;
    city?: string;
    title: string;
    content: string;
}) => Promise<{
    id: string;
    email: string;
    name: string;
    createdAt: Date;
    updatedAt: Date;
    title: string;
    content: string;
    status: string;
    city: string | null;
}>;
export {};
//# sourceMappingURL=testimonial.service.d.ts.map