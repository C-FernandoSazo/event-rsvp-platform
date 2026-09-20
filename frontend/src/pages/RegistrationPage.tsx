import { useEffect, useState } from 'react';
import { getCatalogItems } from '../api/catalog-items.api';
import { createCustomer,  getCustomerByEmail } from '../api/customers.api';
import { getEvents } from '../api/events.api';
import { createRegistration } from '../api/registrations.api';
import { deleteSession, getSession, updateSession } from '../api/session.api';
import { CatalogSelector } from '../components/CatalogSelector';
import { CustomerForm } from '../components/CustomerForm';
import { EventSelector } from '../components/EventSelector';
import { RegistrationSummary } from '../components/RegistrationSummary';
import type { CatalogItem } from '../types/catalog-item';
import type { CreateCustomer } from '../types/customer';
import type { Event } from '../types/event';
import type { Registration } from '../types/registration';

export function RegistrationPage() {
  const [customer, setCustomer] =
    useState<CreateCustomer>({
      firstName: '',
      lastName: '',
      email: '',
    });

  const [events, setEvents] =
    useState<Event[]>([]);

  const [catalogItems, setCatalogItems] =
    useState<CatalogItem[]>([]);

  const [eventId, setEventId] =
    useState<number | null>(null);

  const [
    attendanceDatetime,
    setAttendanceDatetime,
  ] = useState('');

  const [
    selectedItemIds,
    setSelectedItemIds,
  ] = useState<number[]>([]);

  const [registration, setRegistration] =
    useState<Registration | null>(null);

  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    try {
      const [
        eventsData,
        catalogData,
        sessionData,
      ] = await Promise.all([
        getEvents(),
        getCatalogItems(),
        getSession(),
      ]);

      setEvents(
        eventsData.filter((event) => event.active),
      );

      setCatalogItems(catalogData);

      if (sessionData.eventId) {
        setEventId(sessionData.eventId);
      }

      if (sessionData.attendanceDatetime) {
        setAttendanceDatetime(
          sessionData.attendanceDatetime,
        );
      }

      setSelectedItemIds(
        sessionData.itemIds ?? [],
      );
    } catch (error) {
      showError(error);
    }
  }

  async function handleEventChange(
    id: number,
  ) {
    setEventId(id);

    try {
      await updateSession({
        eventId: id,
      });
    } catch (error) {
      showError(error);
    }
  }

  async function handleDateChange(
    date: string,
  ) {
    setAttendanceDatetime(date);

    try {
      await updateSession({
        attendanceDatetime: date,
      });
    } catch (error) {
      showError(error);
    }
  }

  async function handleItemToggle(
    id: number,
  ) {
    const newItemIds =
      selectedItemIds.includes(id)
        ? selectedItemIds.filter(
            (itemId) => itemId !== id,
          )
        : [...selectedItemIds, id];

    setSelectedItemIds(newItemIds);

    try {
      await updateSession({
        itemIds: newItemIds,
      });
    } catch (error) {
      showError(error);
    }
  }

  async function handleSubmit() {
    setMessage('');
    setError('');

    if (
      !customer.firstName.trim() ||
      !customer.lastName.trim() ||
      !customer.email.trim()
    ) {
      setError(
        'Complete la información del cliente',
      );
      return;
    }

    if (!eventId) {
      setError('Seleccione un evento');
      return;
    }

    if (!attendanceDatetime) {
      setError('Seleccione fecha y hora');
      return;
    }

    if (selectedItemIds.length === 0) {
      setError(
        'Seleccione al menos un producto o servicio',
      );
      return;
    }

    try {
      let savedCustomer =
        await getCustomerByEmail(
          customer.email,
        );

      if (!savedCustomer) {
        savedCustomer =
          await createCustomer(customer);
      }

      await updateSession({
        customerId: savedCustomer.id,
      });

      const result =
        await createRegistration({
          customerId: savedCustomer.id,
          eventId,
          attendanceDatetime,
          itemIds: selectedItemIds,
        });

      setRegistration(result);

      setMessage(
        'Asistencia confirmada correctamente',
      );

      await deleteSession();
    } catch (error) {
      showError(error);
    }
  }

  function showError(error: unknown) {
    if (error instanceof Error) {
      setError(error.message);
      return;
    }

    setError('Ocurrió un error');
  }

  return (
    <div className="container">
      <h1>Confirmación de asistencia</h1>

      {message && (
        <div className="message success">
          {message}
        </div>
      )}

      {error && (
        <div className="message error">
          {error}
        </div>
      )}

      <CustomerForm
        customer={customer}
        onChange={setCustomer}
      />

      <EventSelector
        events={events}
        eventId={eventId}
        attendanceDatetime={
          attendanceDatetime
        }
        onEventChange={
          handleEventChange
        }
        onDateChange={
          handleDateChange
        }
      />

      <CatalogSelector
        items={catalogItems}
        selectedItemIds={selectedItemIds}
        onToggle={handleItemToggle}
      />

      <button
        className="confirm-button"
        onClick={handleSubmit}
      >
        Confirmar asistencia
      </button>

      {registration && (
        <RegistrationSummary
          registration={registration}
        />
      )}
    </div>
  );
}