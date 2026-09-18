import {IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString, MaxLength, Min} from 'class-validator';

import { CatalogItemType } from '../entities/catalog-item.entity';

export class CreateCatalogItemDto {
    @IsString()
    @IsNotEmpty()
    @MaxLength(100)
    name: string;

    @IsString()
    @IsOptional()
    @MaxLength(500)
    description?: string;

    @IsEnum(CatalogItemType)
    type: CatalogItemType;

    @IsNumber()
    @Min(0)
    price: number;
}