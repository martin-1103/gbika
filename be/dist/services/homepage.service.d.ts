interface HomepageData {
    latest_articles: any[];
    today_schedule: any[];
    timestamp: string;
}
declare const getHomepageData: () => Promise<HomepageData>;
declare const getCachedHomepageData: () => Promise<HomepageData>;
declare const invalidateHomepageCache: () => Promise<void>;
export { getHomepageData, getCachedHomepageData, invalidateHomepageCache };
//# sourceMappingURL=homepage.service.d.ts.map