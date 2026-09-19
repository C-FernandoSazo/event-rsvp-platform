import 'express-session';

declare module 'express-session' {
    interface SessionData {
        customerId?: number;
        eventId?: number;
        attendanceDatetime?: string;
        itemIds?: number[];
    }
}