'use client';
import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { useEffect, useState } from 'react';
import axios from 'axios';

import SideBar from '@/app/SideBar';
import NavBar from '@/app/NavBar';
import Scheduler from '@/app/Scheduler';
import toDate from 'date-fns/toDate';
import format from 'date-fns/format';
import { uk } from 'date-fns/locale';
import { enUS } from 'date-fns/locale';
import { ProcessedEvent } from '@aldabil/react-scheduler/types';

interface Props {
  params: { id: string };
}

enum Status {
  OPEN = 'OPEN',
  IN_PROGRESS = 'IN_PROGRESS',
  CLOSED = 'CLOSED',
}

interface Event {
  event_id: number;
  title: string;
  start: Date | number;
  end: Date | number;
  status: Status;
}

const EventEditPage = ({ params: { id } }: Props) => {
  const [selectedEvent, setSelectedEvent] = useState<Event>();

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const response = await axios.get('/api/events');
        for (let i = 0; i < response.data.length; i++) {
          if (response.data[i].event_id === parseInt(id)) {
            setSelectedEvent(response.data[i]);
          }
        }
      } catch (error) {
        console.error('Error fetching event:', error);
      }
    };

    fetchEvent();
  }, []);

  async function deleteEventOnServer(deletedId: number) {
    if (!deletedId) {
      return console.error('Id is required to delete an event.');
    }

    try {
      const response = await axios.delete(`/api/events/${deletedId}`);

      if (response.status === 200) {
        return true; // Event deleted successfully
      } else {
        console.error('Unexpected response status:', response.status);
        return false; // Unexpected response status
      }
    } catch (error) {
      console.error('Error deleting event:', error);
      throw error; // Propagate the error or handle it as needed
    }
  }

  async function archiveEventOnServer(
    archivedId: number,
    data: any
  ): Promise<ProcessedEvent | undefined> {
    if (!archivedId) {
      console.error('Id is required to delete an event.');
    }

    if (data.status === Status.OPEN) {
      setSelectedEvent({
        ...data,
        status: Status.CLOSED,
      });
    } else {
      setSelectedEvent({
        ...data,
        status: Status.OPEN,
      });
    }

    data = {
      ...selectedEvent,
    };

    try {
      const response = await axios.put(`/api/events/${archivedId}`, data);

      if (response.status === 200) {
        return response.data as ProcessedEvent; // Event archived successfully
      } else {
        console.error('Unexpected response status:', response.status);
        return undefined; // Unexpected response status
      }
    } catch (error) {
      console.error('Error deleting event:', error);
      throw error; // Propagate the error or handle it as needed
    }
  }

  // const startDate = selectedEvent?.start.toLocaleDateString('en-US', {
  //   year: 'numeric',
  //   month: 'long',
  //   day: 'numeric',
  //   hour: 'numeric',
  //   minute: 'numeric',
  //   second: 'numeric',
  //   timeZone: 'UTC', // Specify the timezone if needed
  // });

  let startDate,
    startTime: string | null = null;

  if (selectedEvent && selectedEvent.start !== undefined) {
    const startDateTime = new Date(selectedEvent.start);
    startDate = format(startDateTime, 'd MMMM yyyy', {
      locale: enUS,
    });
    startTime = format(startDateTime, 'h:mm a', {
      // HH:mm (without a) for European time
      locale: enUS,
    });
  }

  let endDate,
    endTime: string | null = null;

  if (selectedEvent && selectedEvent.end !== undefined) {
    const endDateTime = new Date(selectedEvent.end);
    endDate = format(endDateTime, 'd MMMM yyyy', {
      locale: enUS,
    });
    endTime = format(endDateTime, 'h:mm a', {
      // HH:mm (without a) for European time
      locale: enUS,
    });
  }

  console.log(selectedEvent);
  return (
    <>
      <div className="flex w-screen">
        <div>
          <SideBar />
        </div>
        <div className="flex flex-col w-screen">
          <NavBar />
          <h1 className="text-[45px] font-mono self-center">Event details</h1>
          <div className="mt-10 ml-12">
            {selectedEvent ? (
              <>
                <p className="font-medium">Name</p>
                <h1 className="mb-10">{selectedEvent?.title}</h1>

                <p className="font-medium">Time Duration</p>
                {startDate === endDate
                  ? startDate
                  : 'From ' + startDate + ' to ' + endDate}
                <h1 className="mb-3"></h1>
                <h1 className="mb-10">
                  {startTime} - {endTime}
                </h1>

                {/* <p className="font-medium">Ending time</p>
                <h1 className="mb-10">{endDate}</h1> */}

                <p className="font-medium">Status</p>
                <h1 className="mb-10">
                  {selectedEvent.status === 'OPEN'
                    ? 'Opened'
                    : selectedEvent.status === 'CLOSED'
                    ? 'Archived'
                    : 'In Progress'}
                </h1>
                <div className="space-x-5">
                  <button
                    onClick={(e: React.MouseEvent<HTMLButtonElement>) =>
                      deleteEventOnServer(selectedEvent.event_id)
                    }
                    className="px-2 h-10 bg-zinc-200 hover:bg-zinc-300 duration-300 rounded-xl shadow-xl"
                  >
                    Rename
                  </button>
                  <button
                    onClick={(e: React.MouseEvent<HTMLButtonElement>) =>
                      deleteEventOnServer(selectedEvent.event_id)
                    }
                    className="px-2 h-10 bg-zinc-200 hover:bg-zinc-300 duration-300 rounded-xl shadow-xl"
                  >
                    Change time
                  </button>
                  <button
                    onClick={(e: React.MouseEvent<HTMLButtonElement>) =>
                      deleteEventOnServer(selectedEvent.event_id)
                    }
                    className="px-2 h-10 bg-zinc-200 hover:bg-zinc-300 duration-300 rounded-xl shadow-xl"
                  >
                    Delete
                  </button>
                  <button
                    onClick={(e: React.MouseEvent<HTMLButtonElement>) =>
                      archiveEventOnServer(
                        selectedEvent.event_id,
                        selectedEvent
                      )
                    }
                    className="px-2 h-10 bg-zinc-200 hover:bg-zinc-300 duration-300 rounded-xl shadow-xl"
                  >
                    {selectedEvent.status === Status.OPEN
                      ? 'Archive'
                      : 'Unarchive'}
                  </button>
                </div>
              </>
            ) : (
              <h1>Event {id} does not exist!</h1>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default EventEditPage;
