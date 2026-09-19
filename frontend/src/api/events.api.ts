import { request } from './http';
import type { Event } from '../types/event';

export function getEvents() {
    return request<Event[]>('/events');
}

export function getEvent(id: number) {
    return request<Event>(`/events/${id}`);
}