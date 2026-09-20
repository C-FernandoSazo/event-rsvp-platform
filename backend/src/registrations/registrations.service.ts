import { BadRequestException, ConflictException, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { CatalogItemsService } from '../catalog-items/catalog-items.service';
import { CatalogItem, CatalogItemType } from '../catalog-items/entities/catalog-item.entity';
import { CustomersService } from '../customers/customers.service';
import { EventsService } from '../events/events.service';
import { CreateRegistrationDto } from './dto/create-registration.dto';
import { Registration } from './entities/registration.entity';
import { RegistrationItem } from './entities/registration-item.entity';
import { RegistrationSummary } from './entities/registration-summary.entity';
import {type IRegistrationsRepository, REGISTRATIONS_REPOSITORY } from './repositories/registrations.repository.interface';
import { MailService } from '../mail/mail.service';

@Injectable()
export class RegistrationsService {
    constructor(
        @Inject(REGISTRATIONS_REPOSITORY)
        private readonly registrationsRepository: IRegistrationsRepository,
        private readonly customersService: CustomersService,
        private readonly eventsService: EventsService,
        private readonly catalogItemsService: CatalogItemsService,
        private readonly mailService: MailService,
    ) {}

    async create( createRegistrationDto: CreateRegistrationDto ): Promise<Registration> {
        const customer = await this.customersService.findOne(
            createRegistrationDto.customerId,
        );

        const event = await this.eventsService.findOne( createRegistrationDto.eventId );    

        const attendanceDate = new Date(createRegistrationDto.attendanceDatetime);
        const startDate = new Date(`${event.eventDate}T${event.startTime}`);
        const endDate = new Date(`${event.eventDate}T${event.endTime}`);

        if ( attendanceDate < startDate || attendanceDate > endDate ) {
            throw new BadRequestException(
                `La hora de asistencia debe estar entre ${event.startTime} y ${event.endTime}`,
            );
        }

        if (!event.active) {
            throw new BadRequestException(
                'El evento no se encuentra activo',
            );
        }

        const existingRegistration =
        await this.registrationsRepository.findByCustomerAndEvent(
            customer.id,
            event.id,
        );

        if (existingRegistration) {
            throw new ConflictException(
                'El cliente ya confirmó asistencia a este evento',
            );
        }

        const catalogItems = await Promise.all(
            createRegistrationDto.itemIds.map((id) =>
                this.catalogItemsService.findOne(id),
            ),
        );

        const registration = new Registration();

        registration.customer = customer;
        registration.event = event;
        registration.attendanceDatetime = new Date(
            createRegistrationDto.attendanceDatetime,
        );

        const registrationItems =
        this.createRegistrationItems(catalogItems);

        const summaries =
        this.createSummaries(catalogItems);

        const savedRegistration = 
            await this.registrationsRepository.create(
            registration,
            registrationItems,
            summaries,
        );

        try {
            await this.mailService.sendRegistrationConfirmation(
                savedRegistration,
            );
        } catch (error) {
            console.error('Error sending registration confirmation:', error);
        }

        return savedRegistration;
    }

    async findOne(id: number): Promise<Registration> {
        const registration =
        await this.registrationsRepository.findOne(id);

        if (!registration) {
            throw new NotFoundException(
                'Confirmación no encontrada',
            );
        }

        return registration;
    }

    findByCustomer(customerId: number): Promise<Registration[]> {
        return this.registrationsRepository.findByCustomer(
            customerId,
        );
    }

    private createRegistrationItems(catalogItems: CatalogItem[]): RegistrationItem[] {
        return catalogItems.map((catalogItem) => {
            const item = new RegistrationItem();

            item.catalogItem = catalogItem;
            item.unitPrice = Number(catalogItem.price);

            return item;
        });
    }

    private createSummaries(catalogItems: CatalogItem[]): RegistrationSummary[] {
        const products = catalogItems.filter(
        (item) =>
            item.type === CatalogItemType.PRODUCT,
        );

        const services = catalogItems.filter(
        (item) =>
            item.type === CatalogItemType.SERVICE,
        );

        const summaries: RegistrationSummary[] = [];

        if (products.length > 0) {
            summaries.push(
                this.createSummary(
                products,
                CatalogItemType.PRODUCT,
                ),
            );
        }

        if (services.length > 0) {
            summaries.push(
                this.createSummary(
                services,
                CatalogItemType.SERVICE,
                ),
            );
        }

        return summaries;
    }

    private createSummary(items: CatalogItem[], type: CatalogItemType): RegistrationSummary {
        const subtotal = items.reduce(
            (sum, item) =>
                sum + Number(item.price),
            0,
        );

        const discountPercentage =
            this.calculateDiscount(
                type,
                items.length,
                subtotal,
        );

        const discountAmount = Number(
            (
                subtotal *
                (discountPercentage / 100)
            ).toFixed(2),
        );

        const total = Number(
            (subtotal - discountAmount).toFixed(2),
        );

        const summary = new RegistrationSummary();

        summary.itemType = type;
        summary.itemCount = items.length;
        summary.subtotal = subtotal;
        summary.discountPercentage =
        discountPercentage;
        summary.discountAmount = discountAmount;
        summary.total = total;

        return summary;
    }

    private calculateDiscount(type: CatalogItemType, itemCount: number, subtotal: number): number {
        if (type === CatalogItemType.SERVICE) {
            if (
                itemCount >= 2 &&
                subtotal > 1500
            ) {
                return 5;
            }

            if (itemCount >= 2) {
                return 3;
            }

            return 0;
        }

        if (type === CatalogItemType.PRODUCT) {
            if (itemCount >= 5) {
                return 5;
            }

            if (itemCount >= 3) {
                return 3;
            }
        }

        return 0;
    }
}