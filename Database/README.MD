# Base de Datos - Promociones Disagro

Esquema relacional (PostgreSQL) que soporta la plataforma de confirmación de asistencia al evento anual de promociones. Permite registrar clientes, capturar su interés en productos y/o servicios, y calcular automáticamente el descuento que les corresponde según las reglas de negocio definidas por la empresa.

## Índice

- [Resumen del modelo](#resumen-del-modelo)
- [Tablas](#tablas)
- [Reglas de negocio implementadas](#reglas-de-negocio-implementadas)
- [Decisiones de diseño](#decisiones-de-diseño)

[Diagrama Entidad Relación](./EsquemaRelacional.pdf)

---

## Resumen del modelo

El modelo se organiza en tres capas:

1. **Catálogo y contexto** (`events`, `catalog_items`): qué evento existe y qué productos/servicios se ofrecen.
2. **Identidad del cliente** (`customers`): quién confirma asistencia.
3. **Confirmación y cálculo de descuento** (`registrations`, `registration_items`, `registration_summaries`): qué eligió cada cliente y qué descuento le corresponde.

---

## Tablas

### `customers`

Datos del cliente que confirma su asistencia.  

| Columna | Tipo | Notas |
|---|---|---|
| `id` | SERIAL PK | |
| `first_name`, `last_name` | VARCHAR | |
| `email` | VARCHAR UNIQUE | Identifica al cliente de forma única |

### `events`

Los eventos de promociones anuales. Permite que la plataforma soporte más de una edición del evento sin cambiar el esquema.

| Columna | Tipo | Notas |
|---|---|---|
| `id` | SERIAL PK | |
| `name`, `description` | VARCHAR | |
| `event_date`, `start_time`, `end_time` | DATE | |
| `active` | BOOLEAN | Permite desactivar eventos pasados sin borrarlos |

### `catalog_items`

Catálogo unificado de productos y servicios. Se usa una sola tabla con una columna `type` porque comparten exactamente los mismos atributos (nombre, descripción, precio).

| Columna | Tipo | Notas |
|---|---|---|
| `id` | SERIAL PK | |
| `name`, `description` | VARCHAR | |
| `type` | VARCHAR | `'PRODUCT'` o `'SERVICE'` |
| `price` | NUMERIC(10,2) |  |
| `active` | BOOLEAN | Permite retirar items de promoción sin borrar datos histórico |

### `registrations`

La confirmación de asistencia de un cliente a un evento específico.

| Columna | Tipo | Notas |
|---|---|---|
| `id` | SERIAL PK | |
| `customer_id`, `event_id` | INTEGER FK | |
| `attendance_datetime` | TIMESTAMP | Momento en que el cliente asistirá |
| `confirmed_at` | TIMESTAMP | Momento en que se confirmó el registro |

**Restricción clave:** `UNIQUE(customer_id, event_id)` - un cliente solo puede confirmar asistencia una vez por evento. Si necesita modificar su selección, se actualiza el mismo registro en lugar de crear uno nuevo.

### `registration_items`

Detalle de cada producto/servicio que el cliente marcó como de su interés dentro de una confirmación.

| Columna | Tipo | Notas |
|---|---|---|
| `id` | SERIAL PK | |
| `registration_id`, `catalog_item_id` | INTEGER FK | |
| `unit_price` | NUMERIC(10,2) | Precio del item al momento de la confirmación |

**Restricción clave:** `UNIQUE(registration_id, catalog_item_id)` - evita que el mismo item se seleccione dos veces en la misma confirmación.

### `registration_summaries`

El resultado del cálculo de descuento, agregado por tipo de item (`PRODUCT` o `SERVICE`) para cada confirmación.
La separación entre `registration_items` (detalle item por item) y `registration_summaries` (agregado por tipo `PRODUCT`/`SERVICE`) existe porque las reglas de descuento de la empresa **no aplican por item individual, sino por grupo** (cantidad de servicios elegidos, suma de sus precios, cantidad de productos elegidos). Modelarlo así evita que la consistencia del descuento dependa únicamente de la lógica de la aplicación, queda respaldada por la base de datos.

| Columna | Tipo | Notas |
|---|---|---|
| `id` | SERIAL PK | |
| `registration_id` | INTEGER FK | |
| `item_type` | VARCHAR | `'PRODUCT'` o `'SERVICE'` |
| `item_count` | INTEGER | Cantidad de item de ese tipo elegidos debe ser mayor a 0 |
| `subtotal` | NUMERIC(10,2) | Suma de precios antes de descuento |
| `discount_percentage` | NUMERIC(5,2) | 0, 3 o 5, según las reglas de negocio |
| `discount_amount` | NUMERIC(10,2) | Monto de descuento en quetzales |
| `total` | NUMERIC(10,2) | `subtotal - discount_amount` |

---

## Decisiones de diseño

- **Catálogo unificado (`catalog_items`)**: Se realizo de esta manera ya que por el momento no hay atributos que identifiquen cada entidad por separado.  
- **Registro de precios (`unit_price`)**: preserva el precio que vio el cliente al momento de confirmar, independiente de cambios futuros en el catálogo.
- **Descuento agregado en tabla separada (`registration_summaries`)**: las reglas de negocio son sobre el conjunto (cantidad y suma por tipo), no sobre items individuales.