import { Registration } from '../entities/registration.entity';
import { RegistrationItem } from '../entities/registration-item.entity';
import { RegistrationSummary } from '../entities/registration-summary.entity';

export const REGISTRATIONS_REPOSITORY = Symbol( 'REGISTRATIONS_REPOSITORY' );

export interface IRegistrationsRepository {
    create(registration: Registration, items: RegistrationItem[], summaries: RegistrationSummary[]): Promise<Registration>;
    findOne(id: number): Promise<Registration | null>;
    findByCustomerAndEvent(customerId: number, eventId: number): Promise<Registration | null>;
    findByCustomer(customerId: number): Promise<Registration[]>;
}