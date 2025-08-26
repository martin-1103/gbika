"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// [server.ts]: Server entry point with WebSocket support
const app_1 = require("./app");
const dotenv_1 = __importDefault(require("dotenv"));
const http_1 = require("http");
const websocketService = require('./services/websocket.service');
dotenv_1.default.config();
const PORT = process.env.PORT || 3000;
// Create HTTP server
const server = (0, http_1.createServer)(app_1.app);
// Initialize WebSocket service
websocketService.initializeServer(server);
server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    console.log(`WebSocket endpoint available at ws://localhost:${PORT}/livechat/ws`);
});
//# sourceMappingURL=server.js.map