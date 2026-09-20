import type { Event } from '../types/event';

interface Props {
    events: Event[];
    eventId: number | null;
    attendanceDatetime: string;
    onEventChange: (eventId: number) => void;
    onDateChange: (date: string) => void;
}

export function EventSelector({
    events,
    eventId,
    attendanceDatetime,
    onEventChange,
    onDateChange,
}: Props) {
    const selectedEvent = events.find(
        (event) => event.id === eventId,
    );

    function generateTimes(
        startTime: string,
        endTime: string,
    ) {
        const times: string[] = [];

        const [startHour, startMinute] = startTime.split(':').map(Number);

        const [endHour, endMinute] = endTime.split(':').map(Number);

        let current = startHour * 60 + startMinute;

        const end = endHour * 60 + endMinute;

        while (current <= end) {
            const hour = Math.floor(current / 60);
            const minute = current % 60;

            const value =
                `${String(hour).padStart(2, '0')}:` +
                `${String(minute).padStart(2, '0')}`;

            times.push(value);

            current += 10;
        }

        return times;
    }

    function formatTime(time: string) {
        const [hourText, minute] = time.split(':');

        const hour = Number(hourText);
        const period = hour >= 12 ? 'PM' : 'AM';
        const displayHour =hour % 12 || 12;

        return `${displayHour}:${minute} ${period}`;
    }

    function formatDate(date: string) {
        const [year, month, day] = date.split('-');

        return `${day}/${month}/${year}`;
    }

    const times = selectedEvent ? generateTimes( selectedEvent.startTime, selectedEvent.endTime) : [];

    const selectedTime =
        attendanceDatetime.includes('T')
        ? attendanceDatetime
            .split('T')[1]
            .slice(0, 5)
        : '';

    function handleTimeChange(time: string) {
        if (!selectedEvent) {
            return;
        }

        const datetime = `${selectedEvent.eventDate}T${time}`;
        onDateChange(datetime);
    }

    return (
        <div className="section event-section">
        <div className="form-row">
            <label>Evento:</label>

            <select
            value={eventId ?? ''}
            onChange={(e) =>
                onEventChange(
                Number(e.target.value),
                )
            }
            >
            <option value="">
                Seleccione un evento
            </option>

            {events.map((event) => (
                <option
                key={event.id}
                value={event.id}
                >
                {event.name}
                </option>
            ))}
            </select>
        </div>

        {selectedEvent && (
            <>
            <div className="form-row">
                <label>Fecha:</label>

                <input
                type="text"
                value={formatDate(
                    selectedEvent.eventDate,
                )}
                readOnly
                />
            </div>

            <div className="form-row">
                <label>Hora de llegada:</label>

                <select
                value={selectedTime}
                onChange={(e) =>
                    handleTimeChange(
                    e.target.value,
                    )
                }
                >
                <option value="">
                    Seleccione una hora
                </option>

                {times.map((time) => (
                    <option
                    key={time}
                    value={time}
                    >
                    {formatTime(time)}
                    </option>
                ))}
                </select>
            </div>

            <p className="event-schedule">
                Horario del evento:{' '}
                {formatTime(
                selectedEvent.startTime.slice(
                    0,
                    5,
                ),
                )}
                {' - '}
                {formatTime(
                selectedEvent.endTime.slice(
                    0,
                    5,
                ),
                )}
            </p>
            </>
        )}
        </div>
    );
}