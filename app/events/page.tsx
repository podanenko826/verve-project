'use client';
import { Scheduler } from '@aldabil/react-scheduler';

export default function EventsPage() {
  return (
    <>
      <div>
        <Scheduler view="day" />
      </div>
    </>
  );
}
