"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.invalidateHomepageCache = exports.getCachedHomepageData = exports.getHomepageData = void 0;
// HomepageService: Homepage data orchestrator service
const article_service_1 = require("./article.service");
const program_service_1 = require("./program.service");
const redis_1 = require("redis");
// Initialize Redis client
const redis = (0, redis_1.createClient)({
    socket: {
        host: process.env.REDIS_HOST || 'localhost',
        port: parseInt(process.env.REDIS_PORT || '6379')
    }
});
redis.on('error', (err) => {
    console.error('Redis connection error:', err);
});
// Get aggregated homepage data
const getHomepageData = async () => {
    try {
        // Use Promise.all for parallel data fetching
        const [latestArticles, todaySchedule] = await Promise.all([
            (0, article_service_1.findLatest)(3), // Get 3 latest articles
            (0, program_service_1.findTodaySchedule)() // Get today's schedule
        ]);
        // Aggregate the data
        const homepageData = {
            latest_articles: latestArticles,
            today_schedule: todaySchedule,
            timestamp: new Date().toISOString()
        };
        return homepageData;
    }
    catch (error) {
        console.error('Error in getHomepageData:', error);
        throw error;
    }
};
exports.getHomepageData = getHomepageData;
// Get cached homepage data with fallback
const getCachedHomepageData = async () => {
    const cacheKey = 'homepage:data';
    const cacheTTL = 300; // 5 minutes
    try {
        // Try to get from cache first
        const cachedData = await redis.get(cacheKey);
        if (cachedData) {
            console.log('Homepage data served from cache');
            return JSON.parse(cachedData);
        }
        // If not in cache, fetch fresh data
        console.log('Fetching fresh homepage data');
        const freshData = await getHomepageData();
        // Cache the fresh data
        await redis.setEx(cacheKey, cacheTTL, JSON.stringify(freshData));
        return freshData;
    }
    catch (error) {
        console.error('Error in getCachedHomepageData:', error);
        // Fallback: try to get data without cache
        try {
            return await getHomepageData();
        }
        catch (fallbackError) {
            console.error('Fallback also failed:', fallbackError);
            throw fallbackError;
        }
    }
};
exports.getCachedHomepageData = getCachedHomepageData;
// Invalidate homepage cache
const invalidateHomepageCache = async () => {
    try {
        await redis.del('homepage:data');
        console.log('Homepage cache invalidated');
    }
    catch (error) {
        console.error('Error invalidating homepage cache:', error);
    }
};
exports.invalidateHomepageCache = invalidateHomepageCache;
//# sourceMappingURL=homepage.service.js.map