import {ConflictException, Inject, Injectable, NotFoundException} from '@nestjs/common';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';
import { Customer } from './entities/customer.entity';
import { CUSTOMERS_REPOSITORY, type ICustomersRepository} from './repositories/customers.repository.interface';

@Injectable()
export class CustomersService {
    constructor(
        @Inject(CUSTOMERS_REPOSITORY)
        private readonly customersRepository: ICustomersRepository,
    ) {}

    async create(createCustomerDto: CreateCustomerDto): Promise<Customer> {
        const existingCustomer =
        await this.customersRepository.findByEmail(createCustomerDto.email);

        if (existingCustomer) {
        throw new ConflictException('El correo ya se encuentra registrado');
        }

        const customer = new Customer();

        customer.firstName = createCustomerDto.firstName;
        customer.lastName = createCustomerDto.lastName;
        customer.email = createCustomerDto.email;

        return this.customersRepository.create(customer);
    }

    findAll(): Promise<Customer[]> {
        return this.customersRepository.findAll();
    }

    async findOne(id: number): Promise<Customer> {
        const customer = await this.customersRepository.findOne(id);

        if (!customer) {
        throw new NotFoundException('Cliente no encontrado');
        }

        return customer;
    }

    async update(
        id: number,
        updateCustomerDto: UpdateCustomerDto,
    ): Promise<Customer> {
        const customer = await this.findOne(id);

        if (updateCustomerDto.email !== undefined) {
        const existingCustomer =
            await this.customersRepository.findByEmail(updateCustomerDto.email);

        if (existingCustomer && existingCustomer.id !== id) {
            throw new ConflictException('El correo ya se encuentra registrado');
        }
        }

        Object.assign(customer, updateCustomerDto);

        return this.customersRepository.save(customer);
    }

    findByEmail(email: string): Promise<Customer | null> {
        return this.customersRepository.findByEmail(email);
    }
}