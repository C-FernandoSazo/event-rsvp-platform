import 'express-session';

declare module 'express-session' {
    interface SessionData {
        firstName?: string;
        lastName?: string;
        email?: string;
        customerId?: number;
        eventId?: number;
        attendanceDatetime?: string;
        itemIds?: number[];
    }
}