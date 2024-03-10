'use client';
import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import {
  DO_NOT_USE_OR_YOU_WILL_BE_FIRED_EXPERIMENTAL_REACT_NODES,
  useEffect,
  useState,
} from 'react';
import axios from 'axios';

import SideBar from '@/app/SideBar';
import NavBar from '@/app/NavBar';
import Scheduler from '@/app/Scheduler';
import toDate from 'date-fns/toDate';
import format from 'date-fns/format';
import { uk } from 'date-fns/locale';
import { enUS } from 'date-fns/locale';

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
    startDate = format(startDateTime, 'd MMMM yyyy ', {
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
          <h1 className="text-[50px] font-mono self-center">Edit event</h1>
          <div className="mt-10 ml-12">
            {selectedEvent ? (
              <>
                <p className="font-medium">Name</p>
                <h1 className="mb-10">{selectedEvent?.title}</h1>

                <p className="font-medium">Time Duration</p>
                <h1 className="mb-3">
                  From {startDate} to {endDate}
                </h1>
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
