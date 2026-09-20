import type { Registration } from '../types/registration';

interface Props {
    registration: Registration;
    onClose: () => void;
}

export function RegistrationResultModal({
    registration,
    onClose,
}: Props) {
    const grandTotal =
        registration.summaries.reduce(
        (total, summary) =>
            total + Number(summary.total),
        0,
    );

    return (
        <div className="modal-backdrop">
            <div className="result-modal" role="dialog" aria-modal="true">
                <div className="result-modal-header">
                    <h2> Asistencia confirmada </h2>
                    <p> El registro fue realizado correctamente.</p>
                </div>

                <div className="result-event">
                    <strong> {registration.event.name} </strong>

                    <span>
                        {registration.customer.firstName}{' '}
                        {registration.customer.lastName}
                    </span>
                </div>

                <div className="result-summary">
                    {registration.summaries.map(
                        (summary) => {
                        const hasDiscount =
                            Number(summary.discountPercentage) > 0;
                        return (
                            <div className="result-group" key={summary.id}>
                                <div className="result-group-title">
                                    <strong>
                                    {summary.itemType ===
                                    'PRODUCT'
                                        ? 'Productos'
                                        : 'Servicios'}
                                    </strong>

                                    <span>
                                    {summary.itemCount}{' '}
                                    seleccionado
                                    {summary.itemCount !== 1
                                        ? 's'
                                        : ''}
                                    </span>
                                </div>

                                {hasDiscount && (
                                    <>
                                    <div className="result-line">
                                        <span>Subtotal</span>
                                        <span> Q {Number(summary.subtotal).toFixed(2)}</span>
                                    </div>

                                    <div className="result-line discount-line">
                                        <span>Descuento{' '} {Number( summary.discountPercentage).toFixed(0)}%</span>
                                        <span>-Q{Number(summary.discountAmount).toFixed(2)}</span>
                                    </div>
                                    </>
                                )}

                                <div className="result-line total-line">
                                    <span>Total</span>
                                    <strong>Q{Number(summary.total).toFixed(2)}</strong>
                                </div>
                            </div>
                        );
                        },
                    )}
                </div>

                <div className="grand-total">
                    <span>Total general</span>

                    <strong>
                        Q{grandTotal.toFixed(2)}
                    </strong>
                </div>

                <button className="modal-close-button" onClick={onClose}>
                    Cerrar
                </button>
            </div>
        </div>
    );
}