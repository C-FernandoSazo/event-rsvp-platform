export interface SessionData {
    customerId: number | null;
    eventId: number | null;
    attendanceDatetime: string | null;
    itemIds: number[];
}

export interface UpdateSession {
    customerId?: number;
    eventId?: number;
    attendanceDatetime?: string;
    itemIds?: number[];
}

export interface SessionResponse {
    message: string;
    session: SessionData;
}