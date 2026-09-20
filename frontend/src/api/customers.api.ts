import { request } from './http';
import type {CreateCustomer,Customer} from '../types/customer';

export function createCustomer(
    customer: CreateCustomer,
) {
    return request<Customer>('/customers', {
        method: 'POST',
        body: JSON.stringify(customer),
    });
}

export function getCustomers() {
    return request<Customer[]>('/customers');
}

export function getCustomer(id: number) {
    return request<Customer>(`/customers/${id}`);
}

export function getCustomerByEmail(email: string) {
    return request<Customer | null>(`/customers/by-email?email=${encodeURIComponent(email)}`);
}