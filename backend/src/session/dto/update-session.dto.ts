import { ArrayUnique, IsArray, IsDateString, IsInt, IsOptional, IsPositive } from 'class-validator';

export class UpdateSessionDto {
    @IsOptional()
    @IsInt()
    @IsPositive()
    customerId?: number;

    @IsOptional()
    @IsInt()
    @IsPositive()
    eventId?: number;

    @IsOptional()
    @IsDateString()
    attendanceDatetime?: string;

    @IsOptional()
    @IsArray()
    @ArrayUnique()
    @IsInt({ each: true })
    @IsPositive({ each: true })
    itemIds?: number[];
}