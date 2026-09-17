import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CustomersModule } from './customers/customers.module';
import { EventsModule } from './events/events.module';
import { CatalogItemsModule } from './catalog-items/catalog-items.module';
import { RegistrationsModule } from './registrations/registrations.module';

@Module({
  imports: [CustomersModule, EventsModule, CatalogItemsModule, RegistrationsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
