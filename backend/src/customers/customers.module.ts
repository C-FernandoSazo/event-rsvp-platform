import { Module } from '@nestjs/common';
import { CustomersController } from './customers.controller';
import { CustomersService } from './customers.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Customer } from './entities/customer.entity';
import { CustomersRepository } from './repositories/customers.repository';
import { CUSTOMERS_REPOSITORY } from './repositories/customers.repository.interface';

@Module({
  imports: [
    TypeOrmModule.forFeature([Customer]),
  ],
  controllers: [CustomersController],
  providers: [CustomersService,
    {
      provide: CUSTOMERS_REPOSITORY,
      useClass: CustomersRepository,
    },
  ],
  exports: [CustomersService],
})
export class CustomersModule {}
