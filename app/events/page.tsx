'use client';
import { Scheduler } from '@aldabil/react-scheduler';
import { uk } from 'date-fns/locale';

export default function EventsPage() {
  return (
    <>
      <div>
        <Scheduler
          view="day"
          events={[
            {
              event_id: 1,
              title: 'Event 1',
              start: new Date('2023/12/18 09:30'),
              end: new Date('2023/12/18 10:30'),
            },
            {
              event_id: 2,
              title: 'Event 2',
              start: new Date('2023/12/18 11:00'),
              end: new Date('2023/12/18 12:30'),
            },
          ]}
          locale={uk}
          hourFormat="24"
        />
        <button className="border-2 border-gray-400 m-2 bg-gray-300">
          Get Events
        </button>
      </div>
    </>
  );
}
