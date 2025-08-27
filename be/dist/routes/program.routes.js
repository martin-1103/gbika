"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.programRouter = void 0;
// [program.routes.ts]: Program and schedule routes
const express_1 = require("express");
const program_controller_1 = require("../controllers/program.controller");
const programRouter = (0, express_1.Router)();
exports.programRouter = programRouter;
// GET /programs/schedule - Get weekly schedule (public)
programRouter.get('/schedule', program_controller_1.getWeeklySchedule);
//# sourceMappingURL=program.routes.js.map