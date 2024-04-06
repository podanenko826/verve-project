import axios from 'axios';
import React, { useEffect, useState } from 'react';

const DashboardComponent = () => {
  const [events, setEvents] = useState<Event[]>([]);

  const currentDate = new Date();

  const tomorrowDate = currentDate.setDate(currentDate.getDate() + 1);
  const dayAfterTomorrow = currentDate.setDate(currentDate.getDate() + 2);
  const dayAfter2Tomorrow = currentDate.setDate(currentDate.getDate() + 3);
  const dayAfter3Tomorrow = currentDate.setDate(currentDate.getDate() + 4);
  const dayAfter4Tomorrow = currentDate.setDate(currentDate.getDate() + 5);

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

  return (
    <>
      <div className="flex flex-col items-center w-full space-y-6 h-5/6 px-8 md:px-16 overflow-y-scroll">
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

            <div className="flex w-2/3"></div>
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
