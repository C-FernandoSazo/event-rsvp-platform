import { Customer } from '../entities/customer.entity';

export const CUSTOMERS_REPOSITORY = Symbol('CUSTOMERS_REPOSITORY');

export interface ICustomersRepository {
    create(customer: Customer): Promise<Customer>;
    findAll(): Promise<Customer[]>;
    findOne(id: number): Promise<Customer | null>;
    findByEmail(email: string): Promise<Customer | null>;
    save(customer: Customer): Promise<Customer>;
}