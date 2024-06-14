import axios from 'axios';
import { format } from 'date-fns';
import { enUS } from 'date-fns/locale';
import React, { useEffect, useState } from 'react';

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

const DashboardComponent = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [upcomingEvents, setUpcomingEvents] = useState<Event[]>([]);

  const currentDate = new Date();

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const response = await axios.get('/api/events');

        setEvents(response.data);
      } catch (error) {
        console.error('Error fetching event:', error);
      }
    };

    fetchEvent();
  }, []);

  useEffect(() => {
    if (events.length) {
      const sortedEvents = [...events].sort((a, b) => {
        const diffA = Math.abs(
          new Date().getTime() - new Date(a.start).getTime()
        );
        const diffB = Math.abs(
          new Date().getTime() - new Date(b.start).getTime()
        );
        return diffA - diffB;
      });
      setUpcomingEvents(sortedEvents.slice(0, 3));
    }
  }, [events]);

  return (
    <>
      <div className="flex albertsans flex-col items-center w-full space-y-6 h-5/6 px-8 md:px-16 overflow-y-scroll">
        <div className="flex flex-col md:flex-row w-full justify-center space-x-6">
          <div className="flex flex-col w-full md:w-1/3 p-6 justify-center space-y-3 rounded-[25px] border bg-white dark:bg-slate-800">
            <h2 className="text-slate-500 text-[14px] font-normal uppercase">
              Total events
            </h2>
            <h1 className="text-4xl justify-self-start">{events.length}</h1>
            <h2 className="text-green-600">
              ↑ +{events.length} since last month
            </h2>
          </div>

          <div className="flex flex-col w-full md:w-1/3 h-48 p-6 justify-center space-y-3 rounded-[25px] border bg-white dark:bg-slate-800">
            <h2 className="text-slate-500 text-[14px] font-normal uppercase">
              Completed events
            </h2>
            <h1 className="text-4xl justify-self-start">0</h1>
            <h2 className="text-green-600">↑ +0 since last month</h2>
          </div>

          <div className="flex flex-col w-full md:w-1/3 h-48 p-6 justify-center space-y-3 rounded-[25px] border bg-white dark:bg-slate-800">
            <h2 className="text-slate-500 text-[14px] font-normal uppercase">
              Total revenue
            </h2>
            <h1 className="text-4xl justify-self-start">-$10</h1>
            <h2 className="text-red-600">↓ -10 since last month</h2>
          </div>
        </div>

        <div className="flex flex-col md:flex-row w-full h-[300px] space-x-6 justify-center">
          <div className="flex flex-col w-full justify-between p-6 space-y-3 rounded-[25px] border bg-white dark:bg-slate-800">
            <h2 className="text-slate-500 text-[14px] font-normal uppercase">
              Upcoming events
            </h2>

            <div className="flex flex-col-reverse w-full">
              {upcomingEvents.map((item) => (
                <div className="flex items-center space-x-5">
                  <div className="flex flex-col mb-1.5 items-center justify-around w-44 h-20 bg-gradient-home-content1 rounded-2xl">
                    <h1 className="text-gray-50">{item.title}</h1>
                  </div>
                  <h1>
                    {format(new Date(item.start), 'd MMMM yyyy h:mm', {
                      locale: enUS,
                    })}{' '}
                    -{' '}
                    {format(new Date(item.end), 'd MMMM yyyy h:mm', {
                      locale: enUS,
                    })}
                  </h1>
                </div>
              ))}
            </div>
          </div>

          <div className="flex flex-col w-full md:w-1/2 p-6 justify-center space-y-3 rounded-[25px] border bg-white dark:bg-slate-800">
            <h2 className="text-slate-500 text-[14px] font-normal uppercase">
              Total revenue
            </h2>
            <h1 className="text-4xl justify-self-start">-$10</h1>
            <h2 className="text-red-600">↓ -10 since last month</h2>
          </div>
        </div>
      </div>
    </>
  );
};

export default DashboardComponent;
