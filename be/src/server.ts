// [server.ts]: Server entry point with WebSocket support
import { app } from './app';
import dotenv from 'dotenv';
import { createServer } from 'http';
const websocketService = require('./services/websocket.service');

dotenv.config();

const PORT = process.env.PORT || 3000;

// Create HTTP server
const server = createServer(app);

// Initialize WebSocket service
websocketService.initializeServer(server);

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`WebSocket endpoint available at ws://localhost:${PORT}/livechat/ws`);
});
