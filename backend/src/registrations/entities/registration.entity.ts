import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { Customer } from '../../customers/entities/customer.entity';
import { Event } from '../../events/entities/event.entity';
import { RegistrationItem } from './registration-item.entity';
import { RegistrationSummary } from './registration-summary.entity';

@Entity('registrations')
export class Registration {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => Customer, { nullable: false })
    @JoinColumn({ name: 'customer_id' })
    customer: Customer;

    @ManyToOne(() => Event, { nullable: false })
    @JoinColumn({ name: 'event_id' })
    event: Event;

    @Column({ name: 'attendance_datetime', type: 'timestamp' })
    attendanceDatetime: Date;

    @CreateDateColumn({ name: 'confirmed_at' })
    confirmedAt: Date;

    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;

    @UpdateDateColumn({ name: 'updated_at' })
    updatedAt: Date;

    @OneToMany(
        () => RegistrationItem,
        (item) => item.registration,
    )
    items: RegistrationItem[];

    @OneToMany(
        () => RegistrationSummary,
        (summary) => summary.registration,
    )
    summaries: RegistrationSummary[];
}