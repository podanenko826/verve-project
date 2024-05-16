'use client';
import { Scheduler } from '@aldabil/react-scheduler';
import { PrismaClient } from '@prisma/client';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { TextField, Button, DialogActions } from '@mui/material';
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

interface CustomEditorProps {
  scheduler: SchedulerHelpers;
}

const CustomEditor = ({ scheduler }: CustomEditorProps) => {
  const event = scheduler?.edited;
  console.log(scheduler);

  // Make your own form/state
  const [state, setState] = useState({
    title: event?.title || '',
    description: event?.description || '',
  });
  const [error, setError] = useState('');

  const handleChange = (value: string, name: string) => {
    setState((prev) => {
      return {
        ...prev,
        [name]: value,
      };
    });
  };
  const handleSubmit = async () => {
    // Your own validation
    if (state.title.length < 3) {
      return setError('Min 3 letters');
    }

    try {
      scheduler.loading(true);

      /**Simulate remote data saving */
      const added_updated_event = (await new Promise((res) => {
        /**
         * Make sure the event have 4 mandatory fields
         * event_id: string|number
         * title: string
         * start: Date|string
         * end: Date|string
         */
        setTimeout(() => {
          res({
            event_id: event?.event_id || Math.random(),
            title: state.title,
            start: scheduler.state.start.value,
            end: scheduler.state.end.value,
            description: state.description,
          });
        }, 3000);
      })) as ProcessedEvent;

      scheduler.onConfirm(added_updated_event, event ? 'edit' : 'create');
      scheduler.close();
    } finally {
      scheduler.loading(false);
    }
  };
  return (
    <div>
      <div className="p-4">
        <p className="pb-4">Edit event</p>
        <TextField
          label="Title"
          value={state.title}
          onChange={(e) => handleChange(e.target.value, 'title')}
          className="pb-2.5"
          error={!!error}
          helperText={error}
          fullWidth
        />
        <TextField
          label="Description"
          value={state.description}
          onChange={(e) => handleChange(e.target.value, 'description')}
          fullWidth
        />
      </div>
      <DialogActions>
        <Button onClick={scheduler.close}>Cancel</Button>
        <Button onClick={handleSubmit}>Confirm</Button>
      </DialogActions>
    </div>
  );
};

const ISheduller = () => {
  const [error, setError] = useState('');
  const [events, setEvents] = useState<Event[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<Event>();
  const [eventStart, setEventStart] = useState<Date>();
  const [id, setId] = useState('');

  const searchParams = useSearchParams();

  const search = searchParams.get('event_id');
  const session = useSession();

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
      {events.length && !search && !eventStart && (
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
            customEditor={(scheduler) => <CustomEditor scheduler={scheduler} />}
            // locale={uk}
            hourFormat="24"
            onConfirm={handleConfirm}
            onDelete={handleDelete}
            loading={!events}
            // onEventDrop={handleConfirm}
            onSelectedDateChange={refetchData}
            // selectedDate={eventStart}
            // draggable={false}
            viewerExtraComponent={(fields, event) => {
              return (
                <div className="py-2 ml-1.5">
                  <p>
                    {event.description
                      ? `Description: ${event.description}`
                      : 'No description provided'}
                  </p>
                </div>
              );
            }}
          />
        </>
      )}

      {events.length && search && eventStart && (
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
      )}
      {!events.length && (
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
