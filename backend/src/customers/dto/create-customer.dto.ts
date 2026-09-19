import {IsEmail, IsNotEmpty, IsString, MaxLength} from 'class-validator';

export class CreateCustomerDto {
    @IsString()
    @IsNotEmpty()
    @MaxLength(50)
    firstName: string;

    @IsString()
    @IsNotEmpty()
    @MaxLength(50)
    lastName: string;

    @IsEmail()
    @IsNotEmpty()
    @MaxLength(100)
    email: string;
}