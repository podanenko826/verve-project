'use client';
import { Scheduler } from '@aldabil/react-scheduler';
import { PrismaClient } from '@prisma/client';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { TextField, Button, DialogActions, Typography } from '@mui/material';
import PersonRoundedIcon from '@mui/icons-material/PersonRounded';
import {
  EventActions,
  ProcessedEvent,
  SchedulerHelpers,
} from '@aldabil/react-scheduler/types';
import { useSearchParams } from 'next/navigation';

import React from 'react';
import { useRouter } from 'next/navigation';

import { IoRefresh } from 'react-icons/io5';
import { useSession } from 'next-auth/react';
import { RESOURCES } from './resources';

const prisma = new PrismaClient();

enum Status {
  OPEN = 'OPEN',
  IN_PROGRESS = 'IN_PROGRESS',
  CLOSED = 'CLOSED',
}

interface Event {
  event_id: number;
  title: string;
  description: string;
  start: string; // Assuming DateTime is serialized as string
  end: string;
  status: Status;
}

const ISheduller = () => {
  const [error, setError] = useState('');
  const [events, setEvents] = useState<Event[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<Event>();
  const [eventStart, setEventStart] = useState<Date>();
  const [id, setId] = useState('');

  const [isLoading, setIsLoading] = useState<boolean>(true);
  const searchParams = useSearchParams();

  const search = searchParams.get('event_id');
  const session = useSession();
  const [users, setUsers] = useState<any[]>();

  useEffect(() => {
    const findEvent = async () => {
      if (search) {
        try {
          const response = await axios.get(`/api/events/${parseInt(search)}`);
          // setSelectedEvent(response.data);
          // searchedEvent = new Date(response.data.start);
          setEventStart(new Date(response.data.start));
        } catch (error) {
          console.error('Error finding event:', error);
        }
      }
    };

    findEvent();
  }, [search]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('/api/events');

        setEvents(response.data);
      } catch (error) {
        console.error('Error fetching event:', error);
      }
    };

    fetchData();
    setIsLoading(false);
  }, []);

  const addEventOnServer = async (
    data: any
  ): Promise<ProcessedEvent | undefined> => {
    try {
      const response = await axios.post('/api/events', data);

      // Handle the response or return relevant data
      if (response.status === 201) {
        return response.data as ProcessedEvent;
      } else {
        console.error('Unexpected response status:', response.status);
        return undefined;
      }
    } catch (error) {
      console.error('Error adding event:', error);
      throw error; // Propagate the error or handle it as needed
    }
  };

  const updateEventOnServer = async (
    updatedId: any,
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

  async function deleteEventOnServer(deletedId: any) {
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

  const refetchData = async () => {
    try {
      const response = await axios.get('/api/events');
      setEvents(response.data);
    } catch (error) {
      console.error('Error fetching event:', error);
    }
  };
  const handleConfirm = async (event: ProcessedEvent, action: EventActions) => {
    let returnedEvent: ProcessedEvent = {
      ...event,
    };

    if (action === 'edit') {
      returnedEvent = event;
      await updateEventOnServer(returnedEvent.event_id, returnedEvent);
    }
    if (action === 'create') {
      await addEventOnServer(returnedEvent);
    }

    refetchData();

    return returnedEvent;
  };

  // const handleEventDrop = async (
  //   event: DragEvent,
  //   droppedOn: Date,
  //   updatedEvent: ProcessedEvent,
  //   originalEvent: ProcessedEvent
  // ): Promise<void | ProcessedEvent> => {};

  const handleDelete = async (deletedId: any) => {
    await deleteEventOnServer(deletedId);

    return deletedId;
  };

  return (
    <div className="max-h-min md:max-h-screen h-5/6 rounded-2xl mx-0 albertsans lg:mx-2 overflow-y-scroll">
      {events.length && !search && !eventStart ? (
        <>
          <button
            onClick={(e: React.MouseEvent<HTMLButtonElement>) => refetchData()}
            className="text-black dark:text-zinc-400 absolute font-sans rounded-[4.5px] hover:bg-zinc-100 dark:hover:bg-zinc-700 active:bg-zinc-300 dark:active:bg-zinc-500 duration-300 py-1.5 px-1.5 p mt-0.5 flex ml-44 custom-z-index"
          >
            <IoRefresh className="text-2xl mr-1 pb-0.5" />
            Refresh
          </button>
          <Scheduler
            view="day"
            events={events.map((mappedEvent) => ({
              event_id: mappedEvent.event_id,
              title: mappedEvent.title,
              start: new Date(mappedEvent.start),
              end: new Date(mappedEvent.end),
            }))}
            resources={RESOURCES}
            // locale={uk}
            hourFormat="24"
            onConfirm={handleConfirm}
            onDelete={handleDelete}
            loading={isLoading}
            height={660}
            resourceViewMode="tabs"
            // onEventDrop={handleConfirm}
            onSelectedDateChange={refetchData}
            // selectedDate={eventStart}
            // draggable={false}
            // viewerExtraComponent={(fields, event) => {
            //   return (
            //     <div className="py-2 ml-1.5">
            //       <p>
            //         {event.description
            //           ? `Description: ${event.description}`
            //           : 'No description provided'}
            //       </p>
            //     </div>
            //   );
            // }}
            resourceFields={{
              idField: 'admin_id',
              textField: 'title',
              subTextField: 'mobile',
              avatarField: 'title',
              colorField: 'color',
            }}
            fields={[
              {
                name: 'admin_id',
                type: 'select',
                default: RESOURCES[0].admin_id,
                options: RESOURCES.map((res) => {
                  return {
                    id: res.admin_id,
                    text: `${res.title} (${res.mobile})`,
                    value: res.admin_id, //Should match "name" property
                  };
                }),
                config: { label: 'Assignee', required: true },
              },
            ]}
            viewerExtraComponent={(fields, event) => {
              return (
                <div>
                  {fields.map((field, i) => {
                    if (field.name === 'admin_id') {
                      const admin = field.options?.find(
                        (fe) => fe.id === event.admin_id
                      );
                      return (
                        <Typography
                          key={i}
                          style={{ display: 'flex', alignItems: 'center' }}
                          color="textSecondary"
                          variant="caption"
                          noWrap
                        >
                          <PersonRoundedIcon /> {admin!.text}
                        </Typography>
                      );
                    } else {
                      return '';
                    }
                  })}
                </div>
              );
            }}
          />
        </>
      ) : (
        ''
      )}

      {events.length && search && eventStart ? (
        <>
          <button
            onClick={(e: React.MouseEvent<HTMLButtonElement>) => refetchData()}
            className="absolute font-sans rounded-[4.5px] hover:bg-zinc-100 dark:hover:bg-zinc-700 active:bg-zinc-300 dark:active:bg-zinc-700 duration-300 py-1.5 px-1.5 p mt-0.5 flex ml-44 custom-z-index"
          >
            <IoRefresh className="text-2xl mr-1 pb-0.5" />
            Refresh
          </button>
          <Scheduler
            view="day"
            events={events.map((mappedEvent) => ({
              event_id: mappedEvent.event_id,
              title: mappedEvent.title,
              start: new Date(mappedEvent.start),
              end: new Date(mappedEvent.end),
            }))}
            // locale={uk}
            hourFormat="24"
            onConfirm={handleConfirm}
            onDelete={handleDelete}
            onSelectedDateChange={refetchData}
            selectedDate={eventStart}
            draggable={false}
            loading={!events}
          />
        </>
      ) : (
        ''
      )}
      {!events.length ? (
        <>
          <button
            onClick={(e: React.MouseEvent<HTMLButtonElement>) => refetchData()}
            className="absolute font-sans rounded-[4.5px] hover:bg-zinc-100 dark:hover:bg-zinc-700 active:bg-zinc-300 dark:active:bg-zinc-700 duration-300 py-1.5 px-1.5 p mt-0.5 flex ml-44 custom-z-index"
          >
            <IoRefresh className="text-2xl mr-1 pb-0.5" />
            Refresh
          </button>
          <Scheduler
            view="day"
            // locale={uk}
            hourFormat="24"
            onConfirm={handleConfirm}
            onDelete={handleDelete}
            onSelectedDateChange={refetchData}
            draggable={false}
          />
        </>
      ) : (
        ''
      )}

      <div className="ml-5">
        <label>
          Enter ID:
          <input
            className="bg-slate-200 text-black ml-3 pl-2"
            placeholder="event_id"
            type="text"
            value={id}
            onChange={(e) => setId(e.target.value)}
          />
        </label>
        <button
          className="w-20 m-4 h-10 bg-slate-200 dark:bg-slate-600 hover:bg-slate-300 active:bg-slate-400 border-2 dark:border-0"
          onClick={() => handleDelete(id)}
        >
          Delete
        </button>
      </div>
    </div>
  );
};

export default ISheduller;
