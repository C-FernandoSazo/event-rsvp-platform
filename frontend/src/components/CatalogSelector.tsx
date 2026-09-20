import type { CatalogItem } from '../types/catalog-item';
import { useState } from 'react';

interface Props {
    items: CatalogItem[];
    selectedItemIds: number[];
    onToggle: (id: number) => void;
}

export function CatalogSelector({
    items,
    selectedItemIds,
    onToggle,
}: Props) {
    const [search, setSearch] = useState('');

    const filteredItems = items.filter((item) =>
        item.name.toLowerCase().includes(search.toLowerCase()),
    );

    const services = filteredItems.filter((item) => item.type === 'SERVICE');
    const products = filteredItems.filter((item) => item.type === 'PRODUCT');

    function renderItem(item: CatalogItem) {
        const selected =selectedItemIds.includes(item.id);

        return (
            <label
                key={item.id}
                className={`catalog-option ${
                selected ? 'selected' : ''
                }`}
            >
                <input
                    type="checkbox"
                    checked={selected}
                    onChange={() => onToggle(item.id)}
                />

                <div className="catalog-option-info">
                    <span className="catalog-name">
                        {item.name}
                    </span>

                    {item.description && (
                        <span className="catalog-description">
                            {item.description}
                        </span>
                    )}
                </div>

                <span className="catalog-price">
                Q{Number(item.price).toFixed(2)}
                </span>
            </label>
        );
    }


    return (
        <div className="section catalog-section">
            <input
                className="catalog-search"
                type="text"
                placeholder="Buscar producto o servicio..."
                value={search}
                onChange={ (e) => setSearch(e.target.value) }
            />

            <div className="catalog-group">
            <h3>
                Servicios
                <span className="catalog-count">{services.length}</span>
            </h3>

            <div className="catalog-list">
                {services.length > 0 ? (
                services.map(renderItem)
                ) : (
                <p className="empty-text">No se encontraron servicios.</p>
                )}
            </div>
            </div>

            <div className="catalog-group">
            <h3>
                Productos
                <span className="catalog-count">{products.length}</span>
            </h3>

            <div className="catalog-list">
                {products.length > 0 ? (
                products.map(renderItem)
                ) : (
                <p className="empty-text">No se encontraron productos.</p>
                )}
            </div>
            </div>
        </div>
    );
}