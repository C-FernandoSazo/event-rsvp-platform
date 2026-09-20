import { ArrayUnique, IsArray, IsDateString, IsEmail, IsInt, IsOptional, IsPositive, IsString, MaxLength } from 'class-validator';

export class UpdateSessionDto {
    @IsOptional()
    @IsString()
    @MaxLength(50)
    firstName?: string;

    @IsOptional()
    @IsString()
    @MaxLength(50)
    lastName?: string;

    @IsOptional()
    @IsString()
    @MaxLength(100)
    email?: string;

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