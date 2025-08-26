"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.closeRedisConnection = exports.invalidateWeeklyScheduleCache = exports.findWeeklySchedule = exports.findTodaySchedule = void 0;
// [program.service.ts]: Program and schedule business logic
var client_1 = require("@prisma/client");
var prisma = new client_1.PrismaClient();
// Redis client for caching (temporarily disabled for compilation)
var redisClient = null;
// Get today's schedule
var findTodaySchedule = function () { return __awaiter(void 0, void 0, void 0, function () {
    var today, dayOfWeek, schedules, error_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                today = new Date();
                dayOfWeek = today.getDay();
                return [4 /*yield*/, prisma.schedule.findMany({
                        where: {
                            dayOfWeek: dayOfWeek,
                            isActive: true
                        },
                        include: {
                            program: {
                                select: {
                                    id: true,
                                    name: true,
                                    description: true
                                }
                            }
                        },
                        orderBy: {
                            startTime: 'asc'
                        }
                    })];
            case 1:
                schedules = _a.sent();
                // Transform data to match expected format
                return [2 /*return*/, schedules.map(function (schedule) { return ({
                        time: schedule.startTime,
                        endTime: schedule.endTime,
                        program_name: schedule.program.name,
                        program_id: schedule.program.id,
                        description: schedule.program.description
                    }); })];
            case 2:
                error_1 = _a.sent();
                console.error('Error in findTodaySchedule:', error_1);
                throw error_1;
            case 3: return [2 /*return*/];
        }
    });
}); };
exports.findTodaySchedule = findTodaySchedule;
// Get weekly schedule grouped by day with caching
var findWeeklySchedule = function () { return __awaiter(void 0, void 0, void 0, function () {
    var cacheKey, cacheTTL, cachedSchedule, cacheError_1, schedules, weeklySchedule_1, dayNames_1, cacheError_2, error_2;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                cacheKey = 'weekly_schedule';
                cacheTTL = 3600;
                _a.label = 1;
            case 1:
                _a.trys.push([1, 11, , 12]);
                if (!(redisClient && redisClient.isOpen)) return [3 /*break*/, 5];
                _a.label = 2;
            case 2:
                _a.trys.push([2, 4, , 5]);
                return [4 /*yield*/, redisClient.get(cacheKey)];
            case 3:
                cachedSchedule = _a.sent();
                if (cachedSchedule) {
                    console.log('Weekly schedule served from cache');
                    return [2 /*return*/, JSON.parse(cachedSchedule)];
                }
                return [3 /*break*/, 5];
            case 4:
                cacheError_1 = _a.sent();
                console.error('Cache read error:', cacheError_1);
                return [3 /*break*/, 5];
            case 5: return [4 /*yield*/, prisma.schedule.findMany({
                    where: {
                        isActive: true
                    },
                    include: {
                        program: {
                            select: {
                                id: true,
                                name: true,
                                description: true
                            }
                        }
                    },
                    orderBy: [
                        { dayOfWeek: 'asc' },
                        { startTime: 'asc' }
                    ]
                })];
            case 6:
                schedules = _a.sent();
                weeklySchedule_1 = {
                    sunday: [],
                    monday: [],
                    tuesday: [],
                    wednesday: [],
                    thursday: [],
                    friday: [],
                    saturday: []
                };
                dayNames_1 = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
                schedules.forEach(function (schedule) {
                    var dayName = dayNames_1[schedule.dayOfWeek];
                    if (dayName && weeklySchedule_1[dayName]) {
                        weeklySchedule_1[dayName].push({
                            time: schedule.startTime,
                            endTime: schedule.endTime,
                            program_name: schedule.program.name,
                            program_id: schedule.program.id,
                            description: schedule.program.description
                        });
                    }
                });
                if (!(redisClient && redisClient.isOpen)) return [3 /*break*/, 10];
                _a.label = 7;
            case 7:
                _a.trys.push([7, 9, , 10]);
                return [4 /*yield*/, redisClient.setEx(cacheKey, cacheTTL, JSON.stringify(weeklySchedule_1))];
            case 8:
                _a.sent();
                console.log('Weekly schedule cached successfully');
                return [3 /*break*/, 10];
            case 9:
                cacheError_2 = _a.sent();
                console.error('Cache write error:', cacheError_2);
                return [3 /*break*/, 10];
            case 10: return [2 /*return*/, weeklySchedule_1];
            case 11:
                error_2 = _a.sent();
                console.error('Error in findWeeklySchedule:', error_2);
                throw error_2;
            case 12: return [2 /*return*/];
        }
    });
}); };
exports.findWeeklySchedule = findWeeklySchedule;
// Invalidate weekly schedule cache
var invalidateWeeklyScheduleCache = function () { return __awaiter(void 0, void 0, void 0, function () {
    var cacheKey, error_3;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                if (!redisClient || !redisClient.isOpen)
                    return [2 /*return*/];
                _a.label = 1;
            case 1:
                _a.trys.push([1, 3, , 4]);
                cacheKey = 'weekly_schedule';
                return [4 /*yield*/, redisClient.del(cacheKey)];
            case 2:
                _a.sent();
                console.log('Weekly schedule cache invalidated');
                return [3 /*break*/, 4];
            case 3:
                error_3 = _a.sent();
                console.error('Error invalidating weekly schedule cache:', error_3);
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); };
exports.invalidateWeeklyScheduleCache = invalidateWeeklyScheduleCache;
// Close Redis connection (for cleanup)
var closeRedisConnection = function () { return __awaiter(void 0, void 0, void 0, function () {
    var error_4;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                if (!(redisClient && redisClient.isOpen)) return [3 /*break*/, 4];
                _a.label = 1;
            case 1:
                _a.trys.push([1, 3, , 4]);
                return [4 /*yield*/, redisClient.quit()];
            case 2:
                _a.sent();
                console.log('Program service Redis connection closed');
                return [3 /*break*/, 4];
            case 3:
                error_4 = _a.sent();
                console.error('Error closing Redis connection:', error_4);
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); };
exports.closeRedisConnection = closeRedisConnection;
