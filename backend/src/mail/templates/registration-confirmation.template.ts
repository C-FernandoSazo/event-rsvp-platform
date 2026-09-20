import type { Registration } from '../../registrations/entities/registration.entity';

export function registrationConfirmationTemplate(registration: Registration): string {
    const items = registration.items
        .map(
        (item) => `
            <tr>
            <td style="padding:10px;border-bottom:1px solid #eeeeee;">
                ${item.catalogItem.name}
            </td>

            <td style="padding:10px;border-bottom:1px solid #eeeeee;">
                ${
                item.catalogItem.type === 'PRODUCT'
                    ? 'Producto'
                    : 'Servicio'
                }
            </td>

            <td style="padding:10px;border-bottom:1px solid #eeeeee;text-align:right;">
                Q${Number(item.unitPrice).toFixed(2)}
            </td>
            </tr>
        `,
        ).join('');

    const summaries = registration.summaries
        .map(
        (summary) => `
            <div style="
            border:1px solid #dddddd;
            border-radius:8px;
            padding:15px;
            margin-bottom:12px;
            ">
            <strong>
                ${
                summary.itemType === 'PRODUCT'
                    ? 'Productos'
                    : 'Servicios'
                }
            </strong>

            <p>Cantidad: ${summary.itemCount}</p>

            <p>
                Subtotal:
                Q${Number(summary.subtotal).toFixed(2)}
            </p>

            <p style="color:#388e3c;">
                Descuento:
                ${Number(summary.discountPercentage).toFixed(0)}%
            </p>

            <p>
                Total:
                Q${Number(summary.total).toFixed(2)}
            </p>
            </div>
        `,
        )
        .join('');

    const grandTotal = registration.summaries.reduce(
        (total, summary) =>
        total + Number(summary.total),
        0,
    );

    const attendanceDate = new Date(
        registration.attendanceDatetime,
    ).toLocaleString('es-GT', {
        timeZone: 'America/Guatemala',
    });

    return `
        <div style="
        font-family:Arial,Helvetica,sans-serif;
        background:#f2f2f2;
        padding:25px;
        color:#222222;
        ">

        <div style="
            max-width:650px;
            margin:auto;
            background:#ffffff;
            border:1px solid #dddddd;
        ">

            <div style="
            background:#3d3d3d;
            color:#ffffff;
            padding:20px 25px;
            ">
            <h1 style="margin:0;">
                Disagro
            </h1>

            <p style="margin:4px 0 0;">
                Feria de Promociones
            </p>
            </div>

            <div style="padding:25px;">

            <h2>
                Confirmación de asistencia
            </h2>

            <p>
                Hola ${registration.customer.firstName}
                ${registration.customer.lastName},
            </p>

            <p>
                Tu asistencia ha sido confirmada correctamente.
            </p>

            <div style="
                background:#f7f7f7;
                border-left:4px solid #4caf50;
                padding:15px;
                margin:20px 0;
            ">
                <strong>
                ${registration.event.name}
                </strong>

                <p>
                Fecha y hora: ${attendanceDate}
                </p>
            </div>

            <h3>
                Productos y servicios seleccionados
            </h3>

            <table style="
                width:100%;
                border-collapse:collapse;
                margin-bottom:25px;
            ">
                <thead>
                <tr style="background:#f4f4f4;">
                    <th style="padding:10px;text-align:left;">
                    Nombre
                    </th>

                    <th style="padding:10px;text-align:left;">
                    Tipo
                    </th>

                    <th style="padding:10px;text-align:right;">
                    Precio
                    </th>
                </tr>
                </thead>

                <tbody>
                ${items}
                </tbody>
            </table>

            <h3>Resumen de promociones</h3>

            ${summaries}

            <div style="
                background:#3d3d3d;
                color:#ffffff;
                padding:15px;
                text-align:right;
                border-radius:6px;
            ">
                <strong>
                Total general:
                Q${grandTotal.toFixed(2)}
                </strong>
            </div>

            <p style="
                margin-top:25px;
                color:#666666;
            ">
                Gracias por confirmar tu participación.
            </p>

            </div>
        </div>
        </div>
    `;
}