export declare const findTodaySchedule: () => Promise<{
    time: string;
    endTime: string;
    program_name: string;
    program_id: string;
    description: string | null;
}[]>;
export declare const findWeeklySchedule: () => Promise<any>;
export declare const invalidateWeeklyScheduleCache: () => Promise<void>;
export declare const closeRedisConnection: () => Promise<void>;
//# sourceMappingURL=program.service.d.ts.map