import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

@Entity('events')
export class Event {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ length: 100 })
    name: string;

    @Column({ length: 500, nullable: true })
    description: string;

    @Column({ name: 'event_date', type: 'date' })
    eventDate: string;

    @Column({ name: 'start_time', type: 'time', default: '08:00:00' })
    startTime: string;

    @Column({ name: 'end_time', type: 'time', default: '17:00:00' })
    endTime: string;

    @Column({ default: true })
    active: boolean;

    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;

    @UpdateDateColumn({ name: 'updated_at' })
    updatedAt: Date;
}