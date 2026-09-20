import type { Registration } from '../../registrations/entities/registration.entity';

export function registrationConfirmationTemplate(registration: Registration): string {
    const items = registration.items
        .map(
        (item) => `
            <tr>
            <td style="padding:12px 10px;border-bottom:1px solid #eeeeee;">
                ${item.catalogItem.name}
            </td>
            <td style="padding:12px 10px;border-bottom:1px solid #eeeeee;color:#666666;">
                ${item.catalogItem.type === 'PRODUCT' ? 'Producto' : 'Servicio'}
            </td>
            <td style="padding:12px 10px;border-bottom:1px solid #eeeeee;text-align:right;white-space:nowrap;">
                Q${Number(item.unitPrice).toFixed(2)}
            </td>
            </tr>
        `,
    )
    .join('');

    const discountedSummaries = registration.summaries.filter(
        (summary) => Number(summary.discountPercentage) > 0,
    );

    const discounts = discountedSummaries
        .map(
        (summary) => `
            <div style="border:1px solid #dddddd;border-radius:8px;padding:15px;margin-bottom:12px;">
            <div style="font-weight:bold;margin-bottom:10px;">
                ${summary.itemType === 'PRODUCT' ? 'Productos' : 'Servicios'}
            </div>

            <div style="display:flex;justify-content:space-between;margin-bottom:6px;">
                <span>Subtotal</span>
                <span>Q${Number(summary.subtotal).toFixed(2)}</span>
            </div>

            <div style="display:flex;justify-content:space-between;margin-bottom:6px;color:#388e3c;">
                <span>Descuento ${Number(summary.discountPercentage).toFixed(0)}%</span>
                <span>-Q${Number(summary.discountAmount).toFixed(2)}</span>
            </div>

            <div style="display:flex;justify-content:space-between;padding-top:8px;margin-top:8px;border-top:1px solid #eeeeee;">
                <strong>Total</strong>
                <strong>Q${Number(summary.total).toFixed(2)}</strong>
            </div>
            </div>
        `,
        )
        .join('');

    const discountsSection =
        discountedSummaries.length > 0
        ? `
            <h3 style="margin:28px 0 12px;font-size:17px;color:#222222;">
            Descuentos aplicados
            </h3>
            ${discounts}
        `
        : '';

    const grandTotal = registration.summaries.reduce(
        (total, summary) => total + Number(summary.total),
        0,
    );

    const attendanceDate = new Date(registration.attendanceDatetime).toLocaleString('es-GT', {
        timeZone: 'America/Guatemala',
        dateStyle: 'medium',
        timeStyle: 'short',
    });

    return `
        <div style="margin:0;padding:30px 15px;background:#f2f2f2;font-family:Arial,Helvetica,sans-serif;color:#222222;">
        <div style="max-width:650px;margin:0 auto;background:#ffffff;border:1px solid #dddddd;">

            <div style="background:#3d3d3d;color:#ffffff;padding:22px 25px;">
            <h1 style="margin:0;font-size:26px;line-height:1.2;">Disagro</h1>
            <p style="margin:5px 0 0;font-size:15px;">Feria de Promociones</p>
            </div>

            <div style="padding:25px;">
            <h2 style="margin:0 0 15px;font-size:21px;">Confirmación de asistencia</h2>

            <p style="margin:0 0 12px;line-height:1.6;">
                Hola <strong>${registration.customer.firstName} ${registration.customer.lastName}</strong>,
            </p>

            <p style="margin:0 0 20px;line-height:1.6;color:#555555;">
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

            ${discountsSection}

            <table style="width:100%;margin-top:25px;background:#3d3d3d;color:#ffffff;border-radius:8px;border-collapse:separate;">
                <tr>
                    <td style="padding:17px 18px;font-size:15px;text-align:left;">
                        Total general
                    </td>
                    <td style="padding:17px 18px;font-size:20px;font-weight:bold;text-align:right;white-space:nowrap;">
                        Q${grandTotal.toFixed(2)}
                    </td>
                </tr>
            </table>

            <p style="margin:25px 0 0;color:#777777;font-size:13px;line-height:1.5;">
                Gracias por confirmar tu participación en el evento.
            </p>
            </div>

            <div style="background:#3d3d3d;color:#ffffff;padding:12px 25px;text-align:right;font-size:12px;">
            Atención al cliente: 2223-2425
            </div>

        </div>
        </div>
    `;
}