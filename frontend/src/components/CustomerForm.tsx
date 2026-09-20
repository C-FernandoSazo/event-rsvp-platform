import type { CreateCustomer } from '../types/customer';

interface Props {
    customer: CreateCustomer;
    onChange: (customer: CreateCustomer) => void;
}

export function CustomerForm({
    customer,
    onChange,
}: Props) {
    return (
        <div className="section">
        <h2>Información del cliente</h2>

        <div className="form-row">
            <label>Nombre:</label>
            <input
            type="text"
            value={customer.firstName}
            onChange={(e) =>
                onChange({
                ...customer,
                firstName: e.target.value,
                })
            }
            />
        </div>

        <div className="form-row">
            <label>Apellido:</label>
            <input
            type="text"
            value={customer.lastName}
            onChange={(e) =>
                onChange({
                ...customer,
                lastName: e.target.value,
                })
            }
            />
        </div>

        <div className="form-row">
            <label>Correo:</label>
            <input
            type="email"
            value={customer.email}
            onChange={(e) =>
                onChange({
                ...customer,
                email: e.target.value,
                })
            }
            />
        </div>
        </div>
    );
}