import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Resend } from 'resend';
import type { Registration } from '../registrations/entities/registration.entity';
import { registrationConfirmationTemplate } from './templates/registration-confirmation.template';

@Injectable()
export class MailService {
    private readonly resend: Resend;

    constructor(
        private readonly configService: ConfigService,
    ) {
        this.resend = new Resend(
            this.configService.getOrThrow<string>(
                'RESEND_API_KEY',
            ),
        );
    }

    async sendRegistrationConfirmation(registration: Registration) {
        const html =
        registrationConfirmationTemplate(
            registration,
        );

        const { data, error } =
        await this.resend.emails.send({
            from:
            this.configService.getOrThrow<string>(
                'RESEND_FROM',
            ),

            to: [
            registration.customer.email,
            ],

            subject:
            'Confirmación de asistencia - Feria de Promociones',

            html,
        });

        if (error) {
        throw new Error(error.message);
        }

        return data;
    }
}