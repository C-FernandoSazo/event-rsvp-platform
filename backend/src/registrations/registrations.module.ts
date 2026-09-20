import { Module } from '@nestjs/common';
import { RegistrationsController } from './registrations.controller';
import { RegistrationsService } from './registrations.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CatalogItemsModule } from '../catalog-items/catalog-items.module';
import { CustomersModule } from '../customers/customers.module';
import { EventsModule } from '../events/events.module';
import { Registration } from './entities/registration.entity';
import { RegistrationItem } from './entities/registration-item.entity';
import { RegistrationSummary } from './entities/registration-summary.entity';
import { RegistrationsRepository } from './repositories/registrations.repository';
import { REGISTRATIONS_REPOSITORY } from './repositories/registrations.repository.interface';
import { MailModule } from '../mail/mail.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Registration,
      RegistrationItem,
      RegistrationSummary,
    ]),
    CustomersModule,
    EventsModule,
    CatalogItemsModule,
    MailModule,
  ],
  controllers: [RegistrationsController],
  providers: [RegistrationsService,
    {
      provide: REGISTRATIONS_REPOSITORY,
      useClass: RegistrationsRepository,
    },
  ]
})
export class RegistrationsModule {}
