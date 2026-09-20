import type { CatalogItem } from '../types/catalog-item';

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
    const products = items.filter(
        (item) => item.type === 'PRODUCT',
    );

    const services = items.filter(
        (item) => item.type === 'SERVICE',
    );

    return (
        <div className="section">
        <h3>Servicios</h3>

        {services.map((item) => (
            <div
            className="catalog-item"
            key={item.id}
            >
            <input
                type="checkbox"
                checked={selectedItemIds.includes(item.id)}
                onChange={() => onToggle(item.id)}
            />

            <span>
                {item.name} - Q
                {Number(item.price).toFixed(2)}
            </span>
            </div>
        ))}

        <h3 style={{ marginTop: '18px' }}>
            Productos
        </h3>

        {products.map((item) => (
            <div
            className="catalog-item"
            key={item.id}
            >
            <input
                type="checkbox"
                checked={selectedItemIds.includes(item.id)}
                onChange={() => onToggle(item.id)}
            />

            <span>
                {item.name} - Q
                {Number(item.price).toFixed(2)}
            </span>
            </div>
        ))}
        </div>
    );
}