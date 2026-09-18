import {Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn} from 'typeorm';

export enum CatalogItemType {
    PRODUCT = 'PRODUCT',
    SERVICE = 'SERVICE',
}

@Entity('catalog_items')
export class CatalogItem {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ length: 100 })
    name: string;

    @Column({ length: 500, nullable: true })
    description: string;

    @Column({ type: 'varchar', length: 20 })
    type: CatalogItemType;

    @Column({ type: 'numeric', precision: 10, scale: 2 })
    price: number;

    @Column({ default: true })
    active: boolean;

    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;

    @UpdateDateColumn({ name: 'updated_at' })
    updatedAt: Date;
}