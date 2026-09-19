import {Body, Controller, Get, Param, ParseIntPipe, Post} from '@nestjs/common';
import { CreateRegistrationDto } from './dto/create-registration.dto';
import { RegistrationsService } from './registrations.service';

@Controller('registrations')
export class RegistrationsController {
    constructor(
        private readonly registrationsService:
        RegistrationsService,
    ) {}

    @Post()
    create(@Body() createRegistrationDto: CreateRegistrationDto) {
        return this.registrationsService.create(
            createRegistrationDto,
        );
    }

    @Get(':id')
    findOne(@Param('id', ParseIntPipe) id: number) {
        return this.registrationsService.findOne(id);
    }

    @Get('customer/:customerId')
    findByCustomer(@Param('customerId', ParseIntPipe) customerId: number) {
        return this.registrationsService.findByCustomer(
            customerId,
        );
    }
}