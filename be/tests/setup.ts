// [setup.ts]: Global test setup and cleanup for Jest

// Global cleanup after all tests
afterAll(async () => {
  // Force garbage collection if available
  if (global.gc) {
    global.gc();
  }
  
  // Clear all timers
  jest.clearAllTimers();
  
  // Wait for any pending operations
  await new Promise(resolve => setTimeout(resolve, 100));
});

// Increase timeout for all tests
jest.setTimeout(30000);

// Mock console.log to reduce noise in tests - TEMPORARILY DISABLED FOR DEBUGGING
// const originalConsoleLog = console.log;
// beforeAll(() => {
//   console.log = jest.fn();
// });

// afterAll(() => {
//   console.log = originalConsoleLog;
// });