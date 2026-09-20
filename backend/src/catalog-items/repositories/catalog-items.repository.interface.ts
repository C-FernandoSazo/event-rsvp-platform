import {CatalogItem, CatalogItemType} from '../entities/catalog-item.entity';

export const CATALOG_ITEMS_REPOSITORY = Symbol( 'CATALOG_ITEMS_REPOSITORY' );

export interface ICatalogItemsRepository {
    create(catalogItem: CatalogItem): Promise<CatalogItem>;
    findAll(type?: CatalogItemType): Promise<CatalogItem[]>;
    findOne(id: number): Promise<CatalogItem | null>;
    save(catalogItem: CatalogItem): Promise<CatalogItem>;
}