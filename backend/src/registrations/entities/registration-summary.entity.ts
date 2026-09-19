import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { CatalogItemType } from '../../catalog-items/entities/catalog-item.entity';
import { Registration } from './registration.entity';

@Entity('registration_summaries')
export class RegistrationSummary {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(
        () => Registration,
        (registration) => registration.summaries,
        {
        nullable: false,
        onDelete: 'CASCADE',
        },
    )
    @JoinColumn({ name: 'registration_id' })
    registration: Registration;

    @Column({
        name: 'item_type',
        type: 'varchar',
        length: 20,
    })
    itemType: CatalogItemType;

    @Column({ name: 'item_count' })
    itemCount: number;

    @Column({
        type: 'numeric',
        precision: 10,
        scale: 2,
    })
    subtotal: number;

    @Column({
        name: 'discount_percentage',
        type: 'numeric',
        precision: 5,
        scale: 2,
        default: 0,
    })
    discountPercentage: number;

    @Column({
        name: 'discount_amount',
        type: 'numeric',
        precision: 10,
        scale: 2,
        default: 0,
    })
    discountAmount: number;

    @Column({
        type: 'numeric',
        precision: 10,
        scale: 2,
    })
    total: number;

    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;
}