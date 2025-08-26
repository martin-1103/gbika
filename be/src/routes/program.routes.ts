// [program.routes.ts]: Program and schedule routes
import { Router } from 'express';
import { getWeeklySchedule } from '../controllers/program.controller';

const programRouter = Router();

// GET /programs/schedule - Get weekly schedule (public)
programRouter.get('/schedule', getWeeklySchedule);

export { programRouter };