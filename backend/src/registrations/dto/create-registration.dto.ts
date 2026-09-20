import { ArrayNotEmpty, ArrayUnique, IsArray, IsDateString, IsInt, IsPositive } from 'class-validator';

export class CreateRegistrationDto {
    @IsInt()
    @IsPositive()
    customerId: number;

    @IsInt()
    @IsPositive()
    eventId: number;

    @IsDateString()
    attendanceDatetime: string;

    @IsArray()
    @ArrayNotEmpty()
    @ArrayUnique()
    @IsInt({ each: true })
    @IsPositive({ each: true })
    itemIds: number[];
}