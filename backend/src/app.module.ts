import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CustomersModule } from './customers/customers.module';
import { EventsModule } from './events/events.module';
import { CatalogItemsModule } from './catalog-items/catalog-items.module';
import { RegistrationsModule } from './registrations/registrations.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { SessionModule } from './session/session.module';

@Module({
  imports: [CustomersModule, EventsModule, 

    ConfigModule.forRoot({
      isGlobal: true,
    }),
    
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT),
      username: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      autoLoadEntities: true,
      synchronize: true,
    }),
    CatalogItemsModule, RegistrationsModule, SessionModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
