// [scheduler.service.ts]: Scheduled posting job system
import { findScheduledArticlesReadyToPublish, publishScheduledArticle } from './article.service';

// Job interval in milliseconds (1 minute)
const JOB_INTERVAL = 60 * 1000;

// Track if scheduler is running
let schedulerInterval: NodeJS.Timeout | null = null;

// Process scheduled articles job
export const processScheduledArticles = async (): Promise<void> => {
  try {
    console.log('🕐 Checking for scheduled articles to publish...');
    
    // Find articles that are ready to be published
    const articlesToPublish = await findScheduledArticlesReadyToPublish();
    
    if (articlesToPublish.length === 0) {
      console.log('✅ No scheduled articles ready to publish');
      return;
    }
    
    console.log(`📝 Found ${articlesToPublish.length} article(s) ready to publish`);
    
    // Publish each article
    const results = await Promise.allSettled(
      articlesToPublish.map(async (article) => {
        try {
          const published = await publishScheduledArticle(article.id);
          console.log(`✅ Published: ${published.title} (${published.slug})`);
          return { success: true, article: published };
        } catch (error) {
          console.error(`❌ Failed to publish: ${article.title} (${article.slug})`, error);
          return { success: false, article, error };
        }
      })
    );
    
    // Log results summary
    const successful = results.filter(r => r.status === 'fulfilled' && r.value.success).length;
    const failed = results.length - successful;
    
    console.log(`📊 Publishing summary: ${successful} successful, ${failed} failed`);
    
  } catch (error) {
    console.error('❌ Error in processScheduledArticles:', error);
  }
};

// Start the scheduled posting scheduler
export const startScheduler = (): void => {
  if (schedulerInterval) {
    console.log('⚠️  Scheduler is already running');
    return;
  }
  
  console.log(`🚀 Starting scheduled posting scheduler (interval: ${JOB_INTERVAL / 1000}s)`);
  
  // Run immediately on start
  processScheduledArticles();
  
  // Set up recurring job
  schedulerInterval = setInterval(async () => {
    await processScheduledArticles();
  }, JOB_INTERVAL);
  
  console.log('✅ Scheduled posting scheduler started');
};

// Stop the scheduled posting scheduler
export const stopScheduler = (): void => {
  if (!schedulerInterval) {
    console.log('⚠️  Scheduler is not running');
    return;
  }
  
  clearInterval(schedulerInterval);
  schedulerInterval = null;
  
  console.log('🛑 Scheduled posting scheduler stopped');
};

// Check if scheduler is running
export const isSchedulerRunning = (): boolean => {
  return schedulerInterval !== null;
};

// Get scheduler status
export const getSchedulerStatus = () => {
  return {
    running: isSchedulerRunning(),
    interval: JOB_INTERVAL,
    nextCheck: schedulerInterval ? 'Every minute' : 'Not scheduled'
  };
};