import { Server } from 'http';
interface ConnectionStats {
    activeConnections: number;
    connections: Array<{
        sessionId: string;
        userName: string;
    }>;
}
declare class WebSocketService {
    private wss;
    constructor();
    initializeServer(server: Server): void;
    private handleConnection;
    private handleMessage;
    private handleSendMessage;
    private handleTyping;
    private handleDisconnection;
    private handleError;
    private setupRedisSubscription;
    private handleAdminMessage;
    private sendEvent;
    private sanitizeText;
    getStats(): ConnectionStats;
    close(): Promise<void>;
}
declare const _default: WebSocketService;
export default _default;
//# sourceMappingURL=websocket.service.d.ts.map