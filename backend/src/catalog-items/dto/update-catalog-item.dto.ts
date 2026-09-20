import { PartialType } from '@nestjs/mapped-types';
import { IsBoolean, IsOptional } from 'class-validator';

import { CreateCatalogItemDto } from './create-catalog-item.dto';

export class UpdateCatalogItemDto extends PartialType(CreateCatalogItemDto) {
    @IsBoolean()
    @IsOptional()
    active?: boolean;
}