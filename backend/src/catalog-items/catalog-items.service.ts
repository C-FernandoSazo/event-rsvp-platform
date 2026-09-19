import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { CreateCatalogItemDto } from './dto/create-catalog-item.dto';
import { UpdateCatalogItemDto } from './dto/update-catalog-item.dto';
import { CatalogItem, CatalogItemType } from './entities/catalog-item.entity';
import { CATALOG_ITEMS_REPOSITORY, type ICatalogItemsRepository } from './repositories/catalog-items.repository.interface';

@Injectable()
export class CatalogItemsService {
    constructor(
        @Inject(CATALOG_ITEMS_REPOSITORY)
        private readonly catalogItemsRepository: ICatalogItemsRepository,
    ) {}

    create(
        createCatalogItemDto: CreateCatalogItemDto,
    ): Promise<CatalogItem> {
        const catalogItem = new CatalogItem();

        catalogItem.name = createCatalogItemDto.name;
        catalogItem.description =
        createCatalogItemDto.description ?? '';
        catalogItem.type = createCatalogItemDto.type;
        catalogItem.price = createCatalogItemDto.price;
        catalogItem.active = true;

        return this.catalogItemsRepository.create(catalogItem);
    }

    findAll(type?: CatalogItemType): Promise<CatalogItem[]> {
        return this.catalogItemsRepository.findAll(type);
    }

    async findOne(id: number): Promise<CatalogItem> {
        const catalogItem =
        await this.catalogItemsRepository.findOne(id);

        if (!catalogItem) {
        throw new NotFoundException(
            'Producto o servicio no encontrado',
        );
        }

        return catalogItem;
    }

    async update(
        id: number,
        updateCatalogItemDto: UpdateCatalogItemDto,
    ): Promise<CatalogItem> {
        const catalogItem = await this.findOne(id);

        Object.assign(catalogItem, updateCatalogItemDto);

        return this.catalogItemsRepository.save(catalogItem);
    }

    async deactivate(id: number): Promise<CatalogItem> {
        const catalogItem = await this.findOne(id);

        catalogItem.active = false;

        return this.catalogItemsRepository.save(catalogItem);
    }
}
