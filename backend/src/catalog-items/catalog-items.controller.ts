import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, Query } from '@nestjs/common';
import { CatalogItemsService } from './catalog-items.service';
import { CreateCatalogItemDto } from './dto/create-catalog-item.dto';
import { UpdateCatalogItemDto } from './dto/update-catalog-item.dto';
import { CatalogItemType } from './entities/catalog-item.entity';

@Controller('catalog-items')
export class CatalogItemsController {
    constructor(
        private readonly catalogItemsService: CatalogItemsService,
    ) {}

    @Post()
    create(
        @Body() createCatalogItemDto: CreateCatalogItemDto,
    ) {
        return this.catalogItemsService.create(
            createCatalogItemDto,
        );
    }

    @Get()
    findAll(
        @Query('type') type?: CatalogItemType,
    ) {
        return this.catalogItemsService.findAll(type);
    }

    @Get(':id')
    findOne(
        @Param('id', ParseIntPipe) id: number,
    ) {
        return this.catalogItemsService.findOne(id);
    }

    @Patch(':id')
    update(
        @Param('id', ParseIntPipe) id: number,
        @Body() updateCatalogItemDto: UpdateCatalogItemDto,
    ) {
        return this.catalogItemsService.update(
            id,
            updateCatalogItemDto,
        );
    }

    @Delete(':id')
    deactivate(
        @Param('id', ParseIntPipe) id: number,
    ) {
        return this.catalogItemsService.deactivate(id);
    }
}