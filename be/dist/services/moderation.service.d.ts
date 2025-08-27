interface MessageWithSession {
    id: string;
    text: string;
    status: string;
    sessionId: string;
    createdAt: Date;
    moderatedAt?: Date;
    moderatedBy?: string;
    session: {
        id: string;
        isActive: boolean;
        guestUser: {
            name: string;
            city: string;
            country: string;
        };
    };
}
type ModerationAction = 'approve' | 'reject' | 'block';
declare const moderateMessage: (messageId: string, action: ModerationAction, moderatorId: string) => Promise<MessageWithSession>;
declare const publishMessageApproved: (message: MessageWithSession) => Promise<void>;
declare const blockUserSession: (sessionId: string) => Promise<void>;
declare const getPendingMessages: (limit?: number, offset?: number) => Promise<MessageWithSession[]>;
declare const getMessageById: (messageId: string) => Promise<MessageWithSession | null>;
export { moderateMessage, getPendingMessages, getMessageById, publishMessageApproved, blockUserSession };
//# sourceMappingURL=moderation.service.d.ts.map