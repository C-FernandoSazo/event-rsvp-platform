import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Event } from '../entities/event.entity';
import { IEventsRepository } from './events.repository.interface';

@Injectable()
export class EventsRepository implements IEventsRepository {
    constructor(
        @InjectRepository(Event)
        private readonly repository: Repository<Event>,
    ) {}

    create(event: Event): Promise<Event> {
        return this.repository.save(event);
    }

    findAll(): Promise<Event[]> {
        return this.repository.find({
        order: {
            eventDate: 'ASC',
        },
        });
    }

    findOne(id: number): Promise<Event | null> {
        return this.repository.findOne({
        where: { id },
        });
    }

    save(event: Event): Promise<Event> {
        return this.repository.save(event);
    }
}