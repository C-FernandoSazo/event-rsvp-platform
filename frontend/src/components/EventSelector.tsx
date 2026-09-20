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
    return (
        <div className="section">
        <h2>Evento</h2>

        <div className="form-row">
            <label>Evento:</label>

            <select
            value={eventId ?? ''}
            onChange={(e) =>
                onEventChange(Number(e.target.value))
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

        <div className="form-row">
            <label>Fecha y hora:</label>

            <input
            type="datetime-local"
            value={attendanceDatetime}
            onChange={(e) =>
                onDateChange(e.target.value)
            }
            />
        </div>
        </div>
    );
}