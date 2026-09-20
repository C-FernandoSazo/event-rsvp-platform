import type { Registration } from '../types/registration';

interface Props {
    registration: Registration;
}

export function RegistrationSummary({
    registration,
}: Props) {
    const grandTotal = registration.summaries.reduce(
        (sum, summary) =>
        sum + Number(summary.total),
        0,
    );

    return (
        <div className="section">
        <h2>Resumen de confirmación</h2>

        <p>
            Cliente: {registration.customer.firstName}{' '}
            {registration.customer.lastName}
        </p>

        <p>
            Evento: {registration.event.name}
        </p>

        {registration.summaries.map((summary) => (
            <div
            className="summary-group"
            key={summary.id}
            >
            <h3>
                {summary.itemType === 'PRODUCT'
                ? 'Productos'
                : 'Servicios'}
            </h3>

            <p>
                Cantidad: {summary.itemCount}
            </p>

            <p>
                Subtotal: Q
                {Number(summary.subtotal).toFixed(2)}
            </p>

            <p>
                Descuento:{' '}
                {Number(
                summary.discountPercentage,
                ).toFixed(0)}
                %
            </p>

            <p>
                Monto de descuento: Q
                {Number(
                summary.discountAmount,
                ).toFixed(2)}
            </p>

            <p>
                Total: Q
                {Number(summary.total).toFixed(2)}
            </p>
            </div>
        ))}

        <h3>
            Total general: Q
            {grandTotal.toFixed(2)}
        </h3>
        </div>
    );
}