"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
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
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createTestimonial = exports.findAllApproved = void 0;
// [testimonial.service.ts]: Testimonial business logic
var client_1 = require("@prisma/client");
var prisma = new client_1.PrismaClient();
// Find all approved testimonials with pagination
var findAllApproved = function () {
    var args_1 = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        args_1[_i] = arguments[_i];
    }
    return __awaiter(void 0, __spreadArray([], args_1, true), void 0, function (options) {
        var page, limit, skip, total, testimonials, totalPages, error_1;
        if (options === void 0) { options = {}; }
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 3, , 4]);
                    page = Math.max(1, options.page || 1);
                    limit = Math.min(50, Math.max(1, options.limit || 10));
                    skip = (page - 1) * limit;
                    return [4 /*yield*/, prisma.testimonial.count({
                            where: {
                                status: 'approved'
                            }
                        })];
                case 1:
                    total = _a.sent();
                    return [4 /*yield*/, prisma.testimonial.findMany({
                            where: {
                                status: 'approved'
                            },
                            select: {
                                id: true,
                                name: true,
                                city: true,
                                title: true,
                                content: true,
                                createdAt: true
                                // Exclude email and other sensitive fields
                            },
                            orderBy: {
                                createdAt: 'desc'
                            },
                            skip: skip,
                            take: limit
                        })];
                case 2:
                    testimonials = _a.sent();
                    totalPages = Math.ceil(total / limit);
                    return [2 /*return*/, {
                            data: testimonials,
                            meta: {
                                page: page,
                                limit: limit,
                                total: total,
                                totalPages: totalPages,
                                hasNext: page < totalPages,
                                hasPrev: page > 1
                            }
                        }];
                case 3:
                    error_1 = _a.sent();
                    console.error('Error in findAllApproved:', error_1);
                    throw error_1;
                case 4: return [2 /*return*/];
            }
        });
    });
};
exports.findAllApproved = findAllApproved;
// Create a new testimonial (for submit endpoint)
var createTestimonial = function (data) { return __awaiter(void 0, void 0, void 0, function () {
    var testimonial, error_2;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, prisma.testimonial.create({
                        data: __assign(__assign({}, data), { status: 'pending' // Default status for new testimonials
                         })
                    })];
            case 1:
                testimonial = _a.sent();
                return [2 /*return*/, testimonial];
            case 2:
                error_2 = _a.sent();
                console.error('Error in createTestimonial:', error_2);
                throw error_2;
            case 3: return [2 /*return*/];
        }
    });
}); };
exports.createTestimonial = createTestimonial;
