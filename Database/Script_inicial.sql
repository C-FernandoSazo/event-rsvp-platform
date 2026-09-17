CREATE DATABASE disagro_promotions;

-- Clientes

CREATE TABLE customers (
    id SERIAL PRIMARY KEY,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Eventos

CREATE TABLE events (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description VARCHAR(500),
    event_date DATE NOT NULL,
    active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Catálogo de productos y servicios

CREATE TABLE catalog_items (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description VARCHAR(500),
    type VARCHAR(20) NOT NULL,
    price NUMERIC(10,2) NOT NULL,
    active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT chk_catalog_item_type
        CHECK (type IN ('PRODUCT', 'SERVICE')),

    CONSTRAINT chk_catalog_item_price
        CHECK (price >= 0)
);

-- Confirmaciones de asistencia

CREATE TABLE registrations (
    id SERIAL PRIMARY KEY,
    customer_id INTEGER NOT NULL,
    event_id INTEGER NOT NULL,
    attendance_datetime TIMESTAMP NOT NULL,
    confirmed_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_registration_customer
        FOREIGN KEY (customer_id)
        REFERENCES customers(id),

    CONSTRAINT fk_registration_event
        FOREIGN KEY (event_id)
        REFERENCES events(id),

    CONSTRAINT uq_registration_customer_event
        UNIQUE (customer_id, event_id)
);

-- Productos y servicios seleccionados en la confirmación

CREATE TABLE registration_items (
    id SERIAL PRIMARY KEY,
    registration_id INTEGER NOT NULL,
    catalog_item_id INTEGER NOT NULL,
    unit_price NUMERIC(10,2) NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_registration_item_registration
        FOREIGN KEY (registration_id)
        REFERENCES registrations(id)
        ON DELETE CASCADE,

    CONSTRAINT fk_registration_item_catalog
        FOREIGN KEY (catalog_item_id)
        REFERENCES catalog_items(id),

    CONSTRAINT uq_registration_catalog_item
        UNIQUE (registration_id, catalog_item_id),

    CONSTRAINT chk_registration_item_price
        CHECK (unit_price >= 0)
);

-- Resumen y descuento por grupo

CREATE TABLE registration_summaries (
    id SERIAL PRIMARY KEY,
    registration_id INTEGER NOT NULL,
    item_type VARCHAR(20) NOT NULL,
    item_count INTEGER NOT NULL,
    subtotal NUMERIC(10,2) NOT NULL,
    discount_percentage NUMERIC(5,2) NOT NULL DEFAULT 0,
    discount_amount NUMERIC(10,2) NOT NULL DEFAULT 0,
    total NUMERIC(10,2) NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_registration_summary_registration
        FOREIGN KEY (registration_id)
        REFERENCES registrations(id)
        ON DELETE CASCADE,

    CONSTRAINT chk_registration_summary_type
        CHECK (item_type IN ('PRODUCT', 'SERVICE')),

    CONSTRAINT chk_registration_summary_count
        CHECK (item_count > 0),

    CONSTRAINT chk_registration_summary_subtotal
        CHECK (subtotal >= 0),

    CONSTRAINT chk_registration_summary_discount
        CHECK (
            discount_percentage >= 0
            AND discount_percentage <= 100
        ),

    CONSTRAINT chk_registration_summary_discount_amount
        CHECK (
            discount_amount >= 0
            AND discount_amount <= subtotal
        ),

    CONSTRAINT chk_registration_summary_total
        CHECK (total >= 0),

    CONSTRAINT uq_registration_summary_type
        UNIQUE (registration_id, item_type)
);

CREATE INDEX idx_registrations_customer
ON registrations(customer_id);

CREATE INDEX idx_registrations_event
ON registrations(event_id);

CREATE INDEX idx_registration_items_registration
ON registration_items(registration_id);

CREATE INDEX idx_registration_items_catalog
ON registration_items(catalog_item_id);

CREATE INDEX idx_registration_summaries_registration
ON registration_summaries(registration_id);

CREATE INDEX idx_catalog_items_type
ON catalog_items(type);