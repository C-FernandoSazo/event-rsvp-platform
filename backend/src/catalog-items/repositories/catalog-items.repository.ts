import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {CatalogItem, CatalogItemType} from '../entities/catalog-item.entity';
import { ICatalogItemsRepository } from './catalog-items.repository.interface';

@Injectable()
export class CatalogItemsRepository implements ICatalogItemsRepository {
    constructor(
        @InjectRepository(CatalogItem)
        private readonly repository: Repository<CatalogItem>,
    ) {}

    create(catalogItem: CatalogItem): Promise<CatalogItem> {
        return this.repository.save(catalogItem);
    }

    findAll(type?: CatalogItemType): Promise<CatalogItem[]> {
        return this.repository.find({
            where: type
                ? { type, active: true }
                : { active: true },
            order: {
                name: 'ASC',
            },
        });
    }

    findOne(id: number): Promise<CatalogItem | null> {
        return this.repository.findOne({
            where: {
                id,
                active: true,
            },
        });
    }

    save(catalogItem: CatalogItem): Promise<CatalogItem> {
        return this.repository.save(catalogItem);
    }
}