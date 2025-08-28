// [scheduler.routes.ts]: Scheduler management routes
import { Router } from 'express';
import { Request, Response, NextFunction } from 'express';
import { authenticateToken } from '../middlewares/auth.middleware';
import { authorizeRoles } from '../middlewares/roles.middleware';
import { 
  getSchedulerStatus, 
  processScheduledArticles,
  startScheduler,
  stopScheduler,
  isSchedulerRunning
} from '../services/scheduler.service';

const schedulerRouter = Router();

// GET /scheduler/status - Get scheduler status (admin only)
schedulerRouter.get('/status',
  authenticateToken,
  authorizeRoles('admin'),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const status = getSchedulerStatus();
      
      res.status(200).json({
        success: true,
        data: status,
        message: 'Scheduler status retrieved successfully'
      });
    } catch (error) {
      console.error('Error getting scheduler status:', error);
      next(error);
    }
  }
);

// POST /scheduler/run - Manually run scheduled posting job (admin only)
schedulerRouter.post('/run',
  authenticateToken,
  authorizeRoles('admin'),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      console.log('Manual scheduler run triggered by admin:', req.user?.email);
      
      await processScheduledArticles();
      
      res.status(200).json({
        success: true,
        message: 'Scheduled posting job executed successfully'
      });
    } catch (error) {
      console.error('Error running scheduled posting job:', error);
      next(error);
    }
  }
);

// POST /scheduler/start - Start scheduler (admin only)
schedulerRouter.post('/start',
  authenticateToken,
  authorizeRoles('admin'),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (isSchedulerRunning()) {
        return res.status(400).json({
          success: false,
          message: 'Scheduler is already running'
        });
      }
      
      startScheduler();
      
      res.status(200).json({
        success: true,
        message: 'Scheduler started successfully'
      });
    } catch (error) {
      console.error('Error starting scheduler:', error);
      next(error);
    }
  }
);

// POST /scheduler/stop - Stop scheduler (admin only)
schedulerRouter.post('/stop',
  authenticateToken,
  authorizeRoles('admin'),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!isSchedulerRunning()) {
        return res.status(400).json({
          success: false,
          message: 'Scheduler is not running'
        });
      }
      
      stopScheduler();
      
      res.status(200).json({
        success: true,
        message: 'Scheduler stopped successfully'
      });
    } catch (error) {
      console.error('Error stopping scheduler:', error);
      next(error);
    }
  }
);

export { schedulerRouter };