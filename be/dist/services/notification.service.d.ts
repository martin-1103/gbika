interface PrayerRequest {
    id: string;
    name: string;
    contact: string;
    content: string;
    isAnonymous: boolean;
    createdAt: Date;
}
interface SongRequest {
    id: string;
    name: string;
    city?: string;
    songTitle: string;
    message?: string;
    createdAt: Date;
}
interface NotificationResult {
    success: boolean;
    message: string;
}
declare const notifyPrayerTeam: (prayerRequest: PrayerRequest) => Promise<NotificationResult>;
declare const sendEmailNotification: (prayerRequest: PrayerRequest) => Promise<NotificationResult>;
declare const getPrayerTeamMembers: () => Promise<any[]>;
declare const closeRedisConnection: () => Promise<void>;
declare const notifyBroadcaster: (songRequest: SongRequest) => Promise<NotificationResult>;
export { notifyPrayerTeam, notifyBroadcaster, sendEmailNotification, getPrayerTeamMembers, closeRedisConnection };
//# sourceMappingURL=notification.service.d.ts.map