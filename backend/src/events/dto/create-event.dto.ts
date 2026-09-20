import {IsDateString, IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';

export class CreateEventDto {
    @IsString()
    @IsNotEmpty()
    @MaxLength(100)
    name: string;

    @IsString()
    startTime: string;

    @IsString()
    endTime: string;

    @IsString()
    @IsOptional()
    @MaxLength(500)
    description?: string;

    @IsDateString()
    eventDate: string;
}