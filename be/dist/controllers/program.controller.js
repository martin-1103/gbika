"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getWeeklySchedule = void 0;
const program_service_1 = require("../services/program.service");
// Get weekly schedule grouped by day
const getWeeklySchedule = async (req, res) => {
    try {
        const weeklySchedule = await (0, program_service_1.findWeeklySchedule)();
        res.status(200).json({
            success: true,
            data: weeklySchedule
        });
    }
    catch (error) {
        console.error('Error in getWeeklySchedule controller:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error while fetching weekly schedule'
        });
    }
};
exports.getWeeklySchedule = getWeeklySchedule;
