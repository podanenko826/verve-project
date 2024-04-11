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
import { fetchData } from 'next-auth/client/_utils';

import { IoRefresh } from 'react-icons/io5';

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

const EventEditPage = () => {
  const [archivedEvents, setArchivedEvents] = useState<Event[]>([]);

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const response = await axios.get('/api/events/closed');

        setArchivedEvents(response.data);
      } catch (error) {
        console.error('Error fetching event:', error);
      }
    };

    fetchEvent();
  }, []);

  const refetchData = async () => {
    try {
      const response = await axios.get('/api/events/closed');

      setArchivedEvents(response.data);
    } catch (error) {
      console.error('Error fetching event:', error);
    }
  };

  async function unarchiveEventOnServer(data: Event) {
    if (!data.event_id) {
      console.error('Id is required to delete an event.');
    }

    const updatedData: Event = {
      ...data,
      status: data.status === Status.OPEN ? Status.CLOSED : Status.OPEN,
    };

    try {
      console.log(updatedData);
      const updatedEvent = await updateEventOnServer(
        data.event_id,
        updatedData
      );

      refetchData();

      console.log('Updated event on server:', updatedEvent);
    } catch (error) {
      console.error('Error archiving event:', error);
    }
  }

  const updateEventOnServer = async (
    updatedId: number,
    data: any
  ): Promise<ProcessedEvent | undefined> => {
    try {
      const response = await axios.put(`/api/events/${updatedId}`, data);

      if (response.status === 200) {
        return response.data as ProcessedEvent;
      } else {
        console.error('Unexpected response status:', response.status);
        return undefined;
      }
    } catch (error) {
      console.error('Error updating event:', error);
      throw error;
    }
  };

  async function deleteEventOnServer(deletedId: number) {
    if (!deletedId) {
      return console.error('Id is required to delete an event.');
    }

    try {
      const response = await axios.delete(`/api/events/${deletedId}`);

      if (response.status === 200) {
        refetchData();
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

  return (
    <>
      <div className="flex w-screen albertsans">
        <div className="hidden md:block">
          <SideBar />
        </div>
        <div className="flex flex-col w-screen">
          <div>
            <NavBar />
          </div>

          <div className="ml-12">
            <div className="flex space-x-10">
              <h1 className="text-[36px] font-mono self-center">
                Archived events
              </h1>

              <button
                onClick={(e: React.MouseEvent<HTMLButtonElement>) =>
                  refetchData()
                }
                className="mt-2 font-sans rounded-[4.5px] h-9 bg-zinc-200 dark:bg-zinc-700 hover:bg-zinc-100 dark:hover:bg-zinc-500 active:bg-zinc-300 dark:active:bg-zinc-400 duration-300 px-1.5 py-1.5 flex ml-44"
              >
                <IoRefresh className="text-2xl mr-1 pb-0.5" />
                Refresh
              </button>
            </div>
            {archivedEvents ? (
              ''
            ) : (
              <>
                <h1>Event does not exist!</h1>
              </>
            )}
            {archivedEvents.map((item) => (
              <div key={item.event_id} className="flex mt-10 space-x-5">
                <p className="font-medium">Name:</p>
                <h1 className="mb-10">{item.title}</h1>

                <p className="font-medium">Duration:</p>
                <h1 className="mb-10">
                  {format(new Date(item.start), 'd MMMM yyyy h:mm', {
                    locale: enUS,
                  })}{' '}
                  -{' '}
                  {format(new Date(item.end), 'd MMMM yyyy h:mm', {
                    locale: enUS,
                  })}
                </h1>

                {/* <p className="font-medium">Ending time</p>
                    <h1 className="mb-10">{endDate}</h1> */}

                <p className="font-medium">Status:</p>
                <h1 className="mb-10">
                  {item.status === Status.OPEN
                    ? 'Opened'
                    : item.status === Status.CLOSED
                    ? 'Archived'
                    : 'In Progress'}
                </h1>

                <button
                  onClick={(e: React.MouseEvent<HTMLButtonElement>) =>
                    unarchiveEventOnServer(item)
                  }
                  className="px-2 h-10 bg-zinc-200 dark:bg-zinc-700 hover:bg-zinc-300 dark:hover:bg-zinc-500 active:bg-zinc-400 duration-300 rounded-[4.5px]"
                >
                  {item.status === Status.OPEN ? 'Archive' : 'Unarchive'}
                </button>

                <button
                  onClick={(e: React.MouseEvent<HTMLButtonElement>) =>
                    deleteEventOnServer(item.event_id)
                  }
                  className="px-2 h-10 bg-zinc-200 dark:bg-zinc-700 hover:bg-zinc-300 dark:hover:bg-zinc-500 active:bg-zinc-400 duration-300 rounded-[4.5px]"
                >
                  Delete
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default EventEditPage;
