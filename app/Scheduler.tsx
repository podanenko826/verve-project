'use client';
import { Scheduler } from '@aldabil/react-scheduler';
import { PrismaClient } from '@prisma/client';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { EventActions, ProcessedEvent } from '@aldabil/react-scheduler/types';
import { useSearchParams } from 'next/navigation';

import React from 'react';
import { useRouter } from 'next/router';

const prisma = new PrismaClient();

enum Status {
  OPEN = 'OPEN',
  IN_PROGRESS = 'IN_PROGRESS',
  CLOSED = 'CLOSED',
}

interface Event {
  event_id: number;
  title: string;
  start: string; // Assuming DateTime is serialized as string
  end: string;
  status: Status;
}

const ISheduller = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<Event>();
  const [eventStart, setEventStart] = useState<Date>();
  // let startDateTime: Date | undefined = new Date();
  const [id, setId] = useState('');

  // // console.log(event_id);

  const searchParams = useSearchParams();

  const search = searchParams.get('event_id');

  useEffect(() => {
    const findEvent = async () => {
      if (search) {
        try {
          const response = await axios.get(`/api/events/${parseInt(search)}`);
          // setSelectedEvent(response.data);
          // searchedEvent = new Date(response.data.start);
          setEventStart(new Date(response.data.start));
        } catch (error) {
          console.error('Error fetching event:', error);
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

  const handleDelete = async (deletedId: any) => {
    await deleteEventOnServer(deletedId);

    return deletedId;
  };

  return (
    <div className="max-h-min md:max-h-screen h-5/6 rounded-2xl mx-0 lg:mx-2 overflow-y-scroll">
      {events !== null && !search && !eventStart && (
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
          // onEventDrop={handleConfirm}
          onSelectedDateChange={refetchData}
          // selectedDate={eventStart}
          // draggable={false}
        />
      )}

      {events !== null && search && eventStart && (
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
          // onEventDrop={handleConfirm}
          onSelectedDateChange={refetchData}
          selectedDate={eventStart}
          // draggable={false}
        />
      )}
      <div>
        <button
          className="w-32 m-4 h-10 bg-slate-400 hover:bg-slate-300 active:bg-slate-500 border-2 dark:border-0"
          onClick={refetchData}
        >
          Refresh data
        </button>

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
