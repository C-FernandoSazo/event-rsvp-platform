export type CatalogItemType =
    | 'PRODUCT'
    | 'SERVICE';

export interface CatalogItem {
    id: number;
    name: string;
    description: string;
    type: CatalogItemType;
    price: string;
    active: boolean;
    createdAt: string;
    updatedAt: string;
}