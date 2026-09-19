import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { CatalogItem } from '../../catalog-items/entities/catalog-item.entity';
import { Registration } from './registration.entity';

@Entity('registration_items')
export class RegistrationItem {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(
        () => Registration,
        (registration) => registration.items,
        {
        nullable: false,
        onDelete: 'CASCADE',
        },
    )
    @JoinColumn({ name: 'registration_id' })
    registration: Registration;

    @ManyToOne(() => CatalogItem, { nullable: false })
    @JoinColumn({ name: 'catalog_item_id' })
    catalogItem: CatalogItem;

    @Column({
        name: 'unit_price',
        type: 'numeric',
        precision: 10,
        scale: 2,
    })
    unitPrice: number;

    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;
}