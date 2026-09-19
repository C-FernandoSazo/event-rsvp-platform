import {Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn} from 'typeorm';

@Entity('customers')
export class Customer {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ name: 'first_name', length: 50 })
    firstName: string;

    @Column({ name: 'last_name', length: 50 })
    lastName: string;

    @Column({ length: 100, unique: true })
    email: string;

    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;

    @UpdateDateColumn({ name: 'updated_at' })
    updatedAt: Date;
}