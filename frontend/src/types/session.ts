export interface SessionData {
    firstName: string;
    lastName: string;
    email: string;
    customerId: number | null;
    eventId: number | null;
    attendanceDatetime: string | null;
    itemIds: number[];
}

export interface UpdateSession {
    firstName?: string;
    lastName?: string;
    email?: string;
    customerId?: number;
    eventId?: number;
    attendanceDatetime?: string;
    itemIds?: number[];
}

export interface SessionResponse {
    message: string;
    session: SessionData;
}