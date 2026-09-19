import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { Registration } from '../entities/registration.entity';
import { RegistrationItem } from '../entities/registration-item.entity';
import { RegistrationSummary } from '../entities/registration-summary.entity';
import { IRegistrationsRepository } from './registrations.repository.interface';

@Injectable()
export class RegistrationsRepository
    implements IRegistrationsRepository
    {
    constructor(
        @InjectRepository(Registration)
        private readonly repository: Repository<Registration>,
        private readonly dataSource: DataSource,
    ) {}

    async create(registration: Registration, items: RegistrationItem[],summaries: RegistrationSummary[]): Promise<Registration> {
        return this.dataSource.transaction(async (manager) => {
            const savedRegistration = await manager.save(
                Registration,
                registration,
            );

            for (const item of items) {
                item.registration = savedRegistration;
            }

            for (const summary of summaries) {
                summary.registration = savedRegistration;
            }

            await manager.save(
                RegistrationItem,
                items,
            );

            await manager.save(
                RegistrationSummary,
                summaries,
            );

            const result = await manager.findOne(Registration, {
                where: {
                id: savedRegistration.id,
                },
                relations: {
                customer: true,
                event: true,
                items: {
                    catalogItem: true,
                },
                summaries: true,
                },
            });

            return result!;
            });
    }

    findOne(id: number): Promise<Registration | null> {
        return this.repository.findOne({
            where: { id },

            relations: {
                customer: true,
                event: true,
                items: {
                catalogItem: true,
                },
                summaries: true,
            },
        });
    }

    findByCustomerAndEvent(customerId: number, eventId: number): Promise<Registration | null> {
        return this.repository.findOne({
            where: {
                customer: {
                id: customerId,
                },
                event: {
                id: eventId,
                },
            },
        });
    }

    findByCustomer(customerId: number): Promise<Registration[]> {
        return this.repository.find({
            where: {
                customer: {
                id: customerId,
                },
            },

            relations: {
                event: true,
                items: {
                catalogItem: true,
                },
                summaries: true,
            },
        });
    }
}