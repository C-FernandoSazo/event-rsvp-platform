import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CatalogItemsController } from './catalog-items.controller';
import { CatalogItemsService } from './catalog-items.service';
import { CatalogItem } from './entities/catalog-item.entity';
import { CatalogItemsRepository } from './repositories/catalog-items.repository';
import { CATALOG_ITEMS_REPOSITORY } from './repositories/catalog-items.repository.interface';

@Module({
  imports: [
    TypeOrmModule.forFeature([CatalogItem]),
  ],
  controllers: [CatalogItemsController],
  providers: [
    CatalogItemsService,
    {
      provide: CATALOG_ITEMS_REPOSITORY,
      useClass: CatalogItemsRepository,
    },
  ],
  exports: [CatalogItemsService]
})

export class CatalogItemsModule {}