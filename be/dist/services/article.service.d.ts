interface FindAllParams {
    page?: number;
    limit?: number;
    sortBy?: 'published_at' | 'createdAt';
    sortOrder?: 'asc' | 'desc';
}
interface FindAllResponse {
    data: any[];
    meta: {
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    };
}
export declare const findAll: (params?: FindAllParams) => Promise<FindAllResponse>;
interface CreateArticleData {
    title: string;
    content: string;
    slug?: string;
    status?: 'draft' | 'published';
}
export declare const createArticle: (data: CreateArticleData) => Promise<{
    id: string;
    createdAt: Date;
    updatedAt: Date;
    title: string;
    published_at: Date | null;
    slug: string;
    content: string;
    status: string;
}>;
export declare const findLatest: (limit?: number) => Promise<{
    id: string;
    createdAt: Date;
    title: string;
    published_at: Date | null;
    slug: string;
    content: string;
    status: string;
}[]>;
export declare const findOneBySlug: (slug: string) => Promise<{
    id: string;
    createdAt: Date;
    updatedAt: Date;
    title: string;
    published_at: Date | null;
    slug: string;
    content: string;
    status: string;
} | null>;
export declare const softDeleteArticle: (slug: string) => Promise<boolean>;
interface UpdateArticleData {
    title?: string;
    content?: string;
    slug?: string;
    status?: 'draft' | 'published';
}
export declare const updateBySlug: (currentSlug: string, data: UpdateArticleData) => Promise<{
    id: string;
    createdAt: Date;
    updatedAt: Date;
    title: string;
    published_at: Date | null;
    slug: string;
    content: string;
    status: string;
}>;
export {};
//# sourceMappingURL=article.service.d.ts.map