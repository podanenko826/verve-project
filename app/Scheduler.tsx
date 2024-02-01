import { Scheduler } from '@aldabil/react-scheduler';
import { PrismaClient } from '@prisma/client';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { EventActions, ProcessedEvent } from '@aldabil/react-scheduler/types';

import React from 'react';

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

  // const postDataToServer = async (data) => {
  //   try {
  //     const response = await axios.post('/api/events', data);
  //   } catch (error) {
  //     console.error('Error:', error);
  //   }
  // };
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

  const handleConfirm = async (event: ProcessedEvent, action: EventActions) => {
    let returnedEvent: ProcessedEvent = {
      ...event,
    };

    // if (action === 'edit') {
    //   returnedEvent = event;
    // }
    if (action === 'create') {
      await addEventOnServer(returnedEvent);
    }

    return returnedEvent;
  };

  const deleteEventOnServer = async (deletedId: number): Promise<boolean> => {
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
  };

  const handleDelete = async (deletedId: any) => {
    await deleteEventOnServer(deletedId);

    return deletedId;
  };

  return (
    <>
      {events !== null && (
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
        />
      )}
    </>
  );
};

export default ISheduller;
