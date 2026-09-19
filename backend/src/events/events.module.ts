import { Module } from '@nestjs/common';
import { EventsController } from './events.controller';
import { EventsService } from './events.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Event } from './entities/event.entity';
import { EventsRepository } from './repositories/events.repository';
import { EVENTS_REPOSITORY } from './repositories/events.repository.interface';

@Module({
  imports: [TypeOrmModule.forFeature([Event])],
  controllers: [EventsController],
  providers: [EventsService, 
    {
      provide: EVENTS_REPOSITORY,
      useClass: EventsRepository,
    },
  ],
  exports: [EventsService]
})
export class EventsModule {}
