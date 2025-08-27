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
exports.closeRedisConnection = exports.cleanupExpiredSessions = exports.invalidateSession = exports.findSessionById = exports.createSession = void 0;
// SessionService: Database operations for livechat sessions
var client_1 = require("@prisma/client");
var jwt = require("jsonwebtoken");
var redis_1 = require("redis");
var prisma = new client_1.PrismaClient();
// Create Redis client with better error handling
var redisClient;
try {
    redisClient = (0, redis_1.createClient)({
        socket: {
            host: process.env.REDIS_HOST || 'localhost',
            port: parseInt(process.env.REDIS_PORT || '6379')
        }
    });
    redisClient.on('error', function (err) {
        console.error('Redis Client Error:', err);
    });
    redisClient.connect().catch(function (err) {
        console.error('Redis connection failed:', err);
    });
}
catch (error) {
    console.error('Failed to create Redis client:', error);
    redisClient = null;
}
// Create new livechat session
var createSession = function (userData) { return __awaiter(void 0, void 0, void 0, function () {
    var name_1, city, country, guestUser, expiresAt, session, tokenPayload, sessionToken, cacheKey, cacheData, cacheError_1, error_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 7, , 8]);
                name_1 = userData.name, city = userData.city, country = userData.country;
                return [4 /*yield*/, prisma.guestUser.create({
                        data: {
                            name: name_1,
                            city: city || null,
                            country: country || null
                        }
                    })];
            case 1:
                guestUser = _a.sent();
                expiresAt = new Date();
                expiresAt.setHours(expiresAt.getHours() + 24);
                return [4 /*yield*/, prisma.session.create({
                        data: {
                            guestUserId: guestUser.id,
                            expiresAt: expiresAt,
                            isActive: true
                        },
                        include: {
                            guestUser: {
                                select: {
                                    id: true,
                                    name: true,
                                    city: true,
                                    country: true
                                }
                            }
                        }
                    })];
            case 2:
                session = _a.sent();
                tokenPayload = {
                    session_id: session.id,
                    user_id: guestUser.id,
                    name: guestUser.name
                };
                sessionToken = jwt.sign(tokenPayload, process.env.JWT_SECRET, { expiresIn: '24h' });
                if (!redisClient) return [3 /*break*/, 6];
                _a.label = 3;
            case 3:
                _a.trys.push([3, 5, , 6]);
                cacheKey = "session:".concat(session.id);
                cacheData = JSON.stringify({
                    id: session.id,
                    guestUserId: session.guestUserId,
                    isActive: session.isActive,
                    expiresAt: session.expiresAt.toISOString(),
                    guestUser: session.guestUser
                });
                return [4 /*yield*/, redisClient.setEx(cacheKey, 86400, cacheData)];
            case 4:
                _a.sent(); // 24 hours TTL
                return [3 /*break*/, 6];
            case 5:
                cacheError_1 = _a.sent();
                console.error('Failed to cache session:', cacheError_1);
                return [3 /*break*/, 6];
            case 6: return [2 /*return*/, {
                    session: session,
                    sessionToken: sessionToken
                }];
            case 7:
                error_1 = _a.sent();
                console.error('Error in createSession:', error_1);
                throw error_1;
            case 8: return [2 /*return*/];
        }
    });
}); };
exports.createSession = createSession;
// Find session by ID with caching
var findSessionById = function (sessionId) { return __awaiter(void 0, void 0, void 0, function () {
    var cacheKey, cachedData, sessionData, cacheError_2, session, cacheKey, cacheData, ttl, cacheError_3, error_2;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 11, , 12]);
                if (!redisClient) return [3 /*break*/, 4];
                _a.label = 1;
            case 1:
                _a.trys.push([1, 3, , 4]);
                cacheKey = "session:".concat(sessionId);
                return [4 /*yield*/, redisClient.get(cacheKey)];
            case 2:
                cachedData = _a.sent();
                if (cachedData) {
                    sessionData = JSON.parse(cachedData);
                    // Check if session is still valid
                    if (new Date(sessionData.expiresAt) > new Date() && sessionData.isActive) {
                        return [2 /*return*/, sessionData];
                    }
                }
                return [3 /*break*/, 4];
            case 3:
                cacheError_2 = _a.sent();
                console.error('Cache read error:', cacheError_2);
                return [3 /*break*/, 4];
            case 4: return [4 /*yield*/, prisma.session.findUnique({
                    where: {
                        id: sessionId
                    },
                    include: {
                        guestUser: {
                            select: {
                                id: true,
                                name: true,
                                city: true,
                                country: true
                            }
                        }
                    }
                })];
            case 5:
                session = _a.sent();
                if (!session) {
                    return [2 /*return*/, null];
                }
                // Check if session is expired or inactive
                if (session.expiresAt < new Date() || !session.isActive) {
                    return [2 /*return*/, null];
                }
                if (!redisClient) return [3 /*break*/, 10];
                _a.label = 6;
            case 6:
                _a.trys.push([6, 9, , 10]);
                cacheKey = "session:".concat(sessionId);
                cacheData = JSON.stringify({
                    id: session.id,
                    guestUserId: session.guestUserId,
                    isActive: session.isActive,
                    expiresAt: session.expiresAt.toISOString(),
                    guestUser: session.guestUser
                });
                ttl = Math.floor((session.expiresAt.getTime() - new Date().getTime()) / 1000);
                if (!(ttl > 0)) return [3 /*break*/, 8];
                return [4 /*yield*/, redisClient.setEx(cacheKey, ttl, cacheData)];
            case 7:
                _a.sent();
                _a.label = 8;
            case 8: return [3 /*break*/, 10];
            case 9:
                cacheError_3 = _a.sent();
                console.error('Failed to update cache:', cacheError_3);
                return [3 /*break*/, 10];
            case 10: return [2 /*return*/, session];
            case 11:
                error_2 = _a.sent();
                console.error('Error in findSessionById:', error_2);
                throw error_2;
            case 12: return [2 /*return*/];
        }
    });
}); };
exports.findSessionById = findSessionById;
// Invalidate session
var invalidateSession = function (sessionId) { return __awaiter(void 0, void 0, void 0, function () {
    var cacheKey, cacheError_4, error_3;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 6, , 7]);
                // Update database
                return [4 /*yield*/, prisma.session.update({
                        where: {
                            id: sessionId
                        },
                        data: {
                            isActive: false
                        }
                    })];
            case 1:
                // Update database
                _a.sent();
                if (!redisClient) return [3 /*break*/, 5];
                _a.label = 2;
            case 2:
                _a.trys.push([2, 4, , 5]);
                cacheKey = "session:".concat(sessionId);
                return [4 /*yield*/, redisClient.del(cacheKey)];
            case 3:
                _a.sent();
                return [3 /*break*/, 5];
            case 4:
                cacheError_4 = _a.sent();
                console.error('Failed to invalidate session cache:', cacheError_4);
                return [3 /*break*/, 5];
            case 5: return [2 /*return*/, true];
            case 6:
                error_3 = _a.sent();
                console.error('Error in invalidateSession:', error_3);
                throw error_3;
            case 7: return [2 /*return*/];
        }
    });
}); };
exports.invalidateSession = invalidateSession;
// Cleanup expired sessions (can be called by a cron job)
var cleanupExpiredSessions = function () { return __awaiter(void 0, void 0, void 0, function () {
    var result, error_4;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, prisma.session.updateMany({
                        where: {
                            expiresAt: {
                                lt: new Date()
                            },
                            isActive: true
                        },
                        data: {
                            isActive: false
                        }
                    })];
            case 1:
                result = _a.sent();
                console.log("Cleaned up ".concat(result.count, " expired sessions"));
                return [2 /*return*/, result.count];
            case 2:
                error_4 = _a.sent();
                console.error('Error in cleanupExpiredSessions:', error_4);
                throw error_4;
            case 3: return [2 /*return*/];
        }
    });
}); };
exports.cleanupExpiredSessions = cleanupExpiredSessions;
// Close Redis connection
var closeRedisConnection = function () { return __awaiter(void 0, void 0, void 0, function () {
    var error_5;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                if (!redisClient) return [3 /*break*/, 4];
                _a.label = 1;
            case 1:
                _a.trys.push([1, 3, , 4]);
                return [4 /*yield*/, redisClient.quit()];
            case 2:
                _a.sent();
                return [3 /*break*/, 4];
            case 3:
                error_5 = _a.sent();
                console.error('Error closing Redis connection:', error_5);
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); };
exports.closeRedisConnection = closeRedisConnection;
