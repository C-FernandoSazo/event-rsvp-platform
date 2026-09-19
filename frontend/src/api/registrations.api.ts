import { request } from './http';
import type { CreateRegistration, Registration } from '../types/registration';

export function createRegistration(
    registration: CreateRegistration,
) {
    return request<Registration>(
        '/registrations',
        {
        method: 'POST',
        body: JSON.stringify(registration),
        },
    );
}

export function getRegistration(id: number) {
    return request<Registration>(
        `/registrations/${id}`,
    );
}

export function getRegistrationsByCustomer(
    customerId: number,
) {
    return request<Registration[]>(
        `/registrations/customer/${customerId}`,
    );
}