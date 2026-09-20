import type { CatalogItem } from './catalog-item';
import type { Customer } from './customer';
import type { Event } from './event';

export interface RegistrationItem {
    id: number;
    unitPrice: string;
    catalogItem: CatalogItem;
    createdAt: string;
}

export interface RegistrationSummary {
    id: number;
    itemType: 'PRODUCT' | 'SERVICE';
    itemCount: number;
    subtotal: string;
    discountPercentage: string;
    discountAmount: string;
    total: string;
    createdAt: string;
}

export interface Registration {
    id: number;
    customer: Customer;
    event: Event;
    attendanceDatetime: string;
    confirmedAt: string;
    createdAt: string;
    updatedAt: string;
    items: RegistrationItem[];
    summaries: RegistrationSummary[];
}

export interface CreateRegistration {
    customerId: number;
    eventId: number;
    attendanceDatetime: string;
    itemIds: number[];
}