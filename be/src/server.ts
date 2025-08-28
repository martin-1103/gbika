// [server.ts]: Server entry point with WebSocket support
import { app } from './app';
import dotenv from 'dotenv';
import { createServer } from 'http';
import websocketService from './services/websocket.service';
import { startScheduler } from './services/scheduler.service';

dotenv.config();

const PORT = process.env.PORT || 3000;

// Create HTTP server
const server = createServer(app);

// Initialize WebSocket service
websocketService.initializeServer(server);

server.listen(PORT, () => {
  const wsPath = process.env.WS_PATH || '/livechat/ws';
  console.log(`Server is running on port ${PORT}`);
  console.log(`WebSocket endpoint available at ws://localhost:${PORT}${wsPath}`);
  
  // Start the scheduled posting scheduler
  startScheduler();
});
