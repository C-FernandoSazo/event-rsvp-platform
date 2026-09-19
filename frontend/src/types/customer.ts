export interface Customer {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
    createdAt: string;
    updatedAt: string;
}

export interface CreateCustomer {
    firstName: string;
    lastName: string;
    email: string;
}