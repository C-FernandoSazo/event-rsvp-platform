import { request } from './http';
import type { SessionData, SessionResponse, UpdateSession} from '../types/session';

export function getSession() {
    return request<SessionData>('/session');
}

export function updateSession(
    data: UpdateSession,
) {
    return request<SessionResponse>('/session', {
        method: 'PATCH',
        body: JSON.stringify(data),
    });
}

export function deleteSession() {
    return request<{ message: string }>(
        '/session',
        {
        method: 'DELETE',
        },
    );
}