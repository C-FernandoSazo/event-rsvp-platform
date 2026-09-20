import { useEffect, useState } from 'react';
import { getCatalogItems } from '../api/catalog-items.api';
import { createCustomer,  getCustomerByEmail } from '../api/customers.api';
import { getEvents } from '../api/events.api';
import { createRegistration } from '../api/registrations.api';
import { deleteSession, getSession, updateSession } from '../api/session.api';
import { CatalogSelector } from '../components/CatalogSelector';
import { CustomerForm } from '../components/CustomerForm';
import { EventSelector } from '../components/EventSelector';
import type { CatalogItem } from '../types/catalog-item';
import type { CreateCustomer } from '../types/customer';
import type { Event } from '../types/event';
import type { Registration } from '../types/registration';
import { RegistrationResultModal } from '../components/RegistrationResultModal';

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

  const [sessionLoaded, setSessionLoaded] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    try {
      const [eventsData, catalogData, sessionData] = await Promise.all([
        getEvents(),
        getCatalogItems(),
        getSession(),
      ]);

      setEvents(eventsData.filter((event) => event.active));
      setCatalogItems(catalogData);

      setCustomer({
        firstName: sessionData.firstName ?? '',
        lastName: sessionData.lastName ?? '',
        email: sessionData.email ?? '',
      });

      if (sessionData.eventId) {
        setEventId(sessionData.eventId);
      }

      if (sessionData.attendanceDatetime) {
        setAttendanceDatetime(sessionData.attendanceDatetime);
      }

      setSelectedItemIds(sessionData.itemIds ?? []);
      setSessionLoaded(true);
    } catch (error) {
      showError(error);
    }
  }

  useEffect(() => {
    if (!sessionLoaded) return;

    const timer = setTimeout(() => {
      updateSession({
        firstName: customer.firstName,
        lastName: customer.lastName,
        email: customer.email,
        ...(eventId ? { eventId } : {}),
        ...(attendanceDatetime ? { attendanceDatetime } : {}),
        itemIds: selectedItemIds,
      }).catch(showError);
    }, 500);

    return () => clearTimeout(timer);
  }, [
    customer,
    eventId,
    attendanceDatetime,
    selectedItemIds,
    sessionLoaded,
  ]);

  function handleEventChange(id: number) {
    setEventId(id);

    const selectedEvent = events.find(
      (event) => event.id === id,
    );

    if (!selectedEvent) {
      setAttendanceDatetime('');
      return;
    }

    const firstAvailableTime = selectedEvent.startTime.slice(0, 5);
    const datetime = `${selectedEvent.eventDate}T${firstAvailableTime}`;

    setAttendanceDatetime(datetime);
  }

  function handleDateChange(date: string) {
    setAttendanceDatetime(date);
  }

  function handleItemToggle(id: number) {
    const newItemIds = selectedItemIds.includes(id)
      ? selectedItemIds.filter((itemId) => itemId !== id)
      : [...selectedItemIds, id];

    setSelectedItemIds(newItemIds);
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
    <div className="page">
      <div className="layout">
        <header className="topbar">
          <div>
            <h1>Disagro</h1>
            <p>Feria de Promociones 2026</p>
          </div>
        </header>

        {(message || error) && (
          <div className="alerts">
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
          </div>
        )}

        <div className="content-grid">
          <div className="column">
            <div className="step-title">
              <span className="step-number">1</span>
              <h2>Ingrese su información</h2>
            </div>

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
          </div>

          <div className="column">
            <div className="step-title">
              <span className="step-number">2</span>
              <h2>
                Seleccione servicios y productos
              </h2>
            </div>

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
          </div>
        </div>

        {registration && (
          <RegistrationResultModal
            registration={registration}
            onClose={() =>
              setRegistration(null)
            }
          />
        )}

        <footer className="footer">
          Atención al cliente: 2223-2425
        </footer>
      </div>
    </div>
  );
}