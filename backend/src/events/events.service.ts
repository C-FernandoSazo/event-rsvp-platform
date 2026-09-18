import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { Event } from './entities/event.entity';
import { EVENTS_REPOSITORY, type IEventsRepository } from './repositories/events.repository.interface';

@Injectable()
export class EventsService {
    constructor(
        @Inject(EVENTS_REPOSITORY)
        private readonly eventsRepository: IEventsRepository,
    ) {}

    create(createEventDto: CreateEventDto): Promise<Event> {
        const event = new Event();

        event.name = createEventDto.name;
        event.description = createEventDto.description ?? '';
        event.eventDate = createEventDto.eventDate;
        event.active = true;

        return this.eventsRepository.create(event);
    }

    findAll(): Promise<Event[]> {
        return this.eventsRepository.findAll();
    }

    async findOne(id: number): Promise<Event> {
        const event = await this.eventsRepository.findOne(id);

        if (!event) {
            throw new NotFoundException('Evento no encontrado');
        }

        return event;
    }

    async update(id: number, updateEventDto: UpdateEventDto): Promise<Event> {
        const event = await this.findOne(id);

        Object.assign(event, updateEventDto);

        return this.eventsRepository.save(event);
    }
}