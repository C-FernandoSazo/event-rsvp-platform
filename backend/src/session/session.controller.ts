import {Body, Controller, Delete, Get, Patch, Req} from '@nestjs/common';
import { type Request } from 'express';
import { UpdateSessionDto } from './dto/update-session.dto';

@Controller('session')
export class SessionController {
    @Get()
    getSession(@Req() req: Request) {
        return {
            firstName: req.session.firstName ?? '',
            lastName: req.session.lastName ?? '',
            email: req.session.email ?? '',
            customerId: req.session.customerId ?? null,
            eventId: req.session.eventId ?? null,
            attendanceDatetime: req.session.attendanceDatetime ?? null,
            itemIds: req.session.itemIds ?? [],
        };
    }

    @Patch()
    updateSession(@Req() req: Request, @Body() updateSessionDto: UpdateSessionDto) {
        Object.assign(req.session, updateSessionDto);

        return {
            message: 'Sesión actualizada correctamente',
            session: {
                customerId: req.session.customerId ?? null,
                eventId: req.session.eventId ?? null,
                attendanceDatetime:
                req.session.attendanceDatetime ?? null,
                itemIds: req.session.itemIds ?? [],
            },
        };
    }

    @Delete()
    destroySession(@Req() req: Request) {
        return new Promise((resolve, reject) => {
            req.session.destroy((error) => {
                if (error) {
                    reject(error);
                    return;
                }
                resolve({ message: 'Sesión eliminada correctamente' });
            });
        });
    }
}