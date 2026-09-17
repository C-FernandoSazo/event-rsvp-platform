import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Customer } from '../entities/customer.entity';
import { ICustomersRepository } from './customers.repository.interface';

@Injectable()
export class CustomersRepository implements ICustomersRepository {
    constructor(
        @InjectRepository(Customer)
        private readonly repository: Repository<Customer>,
    ) {}

    create(customer: Customer): Promise<Customer> {
        return this.repository.save(customer);
    }

    findAll(): Promise<Customer[]> {
        return this.repository.find();
    }

    findOne(id: number): Promise<Customer | null> {
        return this.repository.findOne({
        where: { id },
        });
    }

    findByEmail(email: string): Promise<Customer | null> {
        return this.repository.findOne({
        where: { email },
        });
    }

    save(customer: Customer): Promise<Customer> {
        return this.repository.save(customer);
    }
}