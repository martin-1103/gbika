// [program.controller.ts]: Program and schedule controllers
import { Request, Response } from 'express';
import { findWeeklySchedule } from '../services/program.service';

// Get weekly schedule grouped by day
export const getWeeklySchedule = async (req: Request, res: Response) => {
  try {
    const weeklySchedule = await findWeeklySchedule();
    
    res.status(200).json({
      success: true,
      data: weeklySchedule
    });
  } catch (error) {
    console.error('Error in getWeeklySchedule controller:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error while fetching weekly schedule'
    });
  }
};