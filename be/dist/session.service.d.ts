interface UserData {
    name: string;
    city?: string;
    country?: string;
}
interface CreateSessionResult {
    session: any;
    sessionToken: string;
}
declare const createSession: (userData: UserData) => Promise<CreateSessionResult>;
declare const findSessionById: (sessionId: string) => Promise<any | null>;
declare const invalidateSession: (sessionId: string) => Promise<boolean>;
declare const cleanupExpiredSessions: () => Promise<number>;
declare const closeRedisConnection: () => Promise<void>;
export { createSession, findSessionById, invalidateSession, cleanupExpiredSessions, closeRedisConnection };
