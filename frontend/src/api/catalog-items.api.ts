import { request } from './http';
import type { CatalogItem,CatalogItemType } from '../types/catalog-item';

export function getCatalogItems(
    type?: CatalogItemType,
) {
    const endpoint = type
        ? `/catalog-items?type=${type}`
        : '/catalog-items';

    return request<CatalogItem[]>(endpoint);
}

export function getCatalogItem(id: number) {
    return request<CatalogItem>(`/catalog-items/${id}`);
}