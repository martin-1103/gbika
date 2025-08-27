interface Page {
    id: string;
    title: string;
    slug: string;
    content: string;
    status: string;
    createdAt: Date;
    updatedAt: Date;
}
declare const findOneBySlug: (slug: string) => Promise<Page | null>;
declare const invalidatePageCache: (slug: string) => Promise<void>;
declare const closeRedisConnection: () => Promise<void>;
export { findOneBySlug, invalidatePageCache, closeRedisConnection };
//# sourceMappingURL=page.service.d.ts.map