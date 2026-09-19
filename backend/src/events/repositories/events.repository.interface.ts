import { Event } from '../entities/event.entity';

export const EVENTS_REPOSITORY = Symbol('EVENTS_REPOSITORY');

export interface IEventsRepository {
    create(event: Event): Promise<Event>;
    findAll(): Promise<Event[]>;
    findOne(id: number): Promise<Event | null>;
    save(event: Event): Promise<Event>;
}