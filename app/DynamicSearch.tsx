'use client';
import React, { useEffect, useState } from 'react';
import { IoMdSearch } from 'react-icons/io';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { enUS } from 'date-fns/locale';
import { format } from 'date-fns';
import Link from 'next/link';

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

const DynamicSearch = () => {
  const [data, setData] = useState('');
  const [selectedEvent, setSelectedEvent] = useState<Event>();
  const [eventTitle, setEventTitle] = useState('');
  const [isSearchBarEmpty, setIsSearchBarEmpty] = useState(true);
  const [events, setEvents] = useState<Event[]>([]);

  const router = useRouter();

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

  async function deleteEventOnServer(
    event: React.MouseEvent<HTMLButtonElement>,
    deletedId: any
  ) {
    event.preventDefault();

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

  const handleInput = async (input: string) => {
    setData(input);

    if (input) setIsSearchBarEmpty(false);
    else setIsSearchBarEmpty(true);

    if (input !== 'event') {
      try {
        const response = await axios.get('/api/events');
        setEvents(response.data);

        for (let i = 0; i < response.data.length; i++) {
          let e = response.data[i];

          if (e.title === input) {
            setSelectedEvent(e);
            setEventTitle(e.title);
            break;
          } else {
            setSelectedEvent(undefined);
            setEventTitle('');
          }
        }
      } catch (error) {
        return 'Error fetching event:' + error;
      }
    }
  };

  const handleEventChoose = (
    event: React.MouseEvent<HTMLButtonElement>,
    selectedEventId: number
  ) => {
    event.preventDefault();

    for (let i = 0; i < events.length; i++) {
      if (events[i].event_id === selectedEventId) {
        setData(events[i].title);
        setEventTitle(events[i].title);
        setSelectedEvent(events[i]);
      }
    }
  };

  const handleEdit = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();

    router.push('/events/edit/' + selectedEvent?.event_id);
  };

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

  return (
    <div>
      <form className="flex z-50 mt-6">
        <div className="flex">
          <label htmlFor="search">
            <IoMdSearch className="text-3xl fill-slate-400 absolute pl-2 custom-z-index-greater" />
          </label>
          <input
            type="search"
            id="search"
            name="search"
            value={data}
            onChange={(e) => handleInput(e.target.value)}
            className={`${
              selectedEvent || data.toLowerCase() === 'event'
                ? 'bg-white dark:bg-gray-800 rounded-t-xl'
                : 'shadow-lg active:border-2 hover:shadow-md active:shadow-lg dark:bg-gray-800 rounded-xl'
            } w-40 md:w-72 text-top max-w-96 pl-10 p-0.5 custom-z-index-great outline-none ease-in-out active:scale-y-105 transition-all duration-500 font-semibold`}
          />

          <button
            className={`custom-z-index-great ml-[10px] px-3 bg-slate-50 dark:bg-gray-700 hover:bg-slate-100 dark:hover:bg-slate-600 hover:border active:bg-slate-200 active:scale-x-105 dark:active:bg-slate-800 duration-500 transition-all rounded-lg shadow-lg hover:shadow-xl font-light text-slate-600 dark:text-slate-300`}
            type="submit"
          >
            Search
          </button>
        </div>

        <div
          className={`${
            selectedEvent || data.toLowerCase() === 'event'
              ? 'shadow-lg md:active:border-2 hover:shadow-md active:shadow-lg bg-white dark:bg-gray-800'
              : ' bg-transparent'
          } overflow-x-auto flex flex-col pt-[26px] justify-around items-center rounded-xl absolute w-[245px] max-h-[330px] text-top md:w-96 p-0.5 custom-z-index ease-in-out transition-all duration-500 font-semibold outline-none`}
        >
          {/* Code to display searched event delete and modify buttons */}

          {selectedEvent ? (
            <>
              <div className="flex flex-col items-center w-full">
                <p className="font-mono">{selectedEvent ? eventTitle : ''}</p>
                {startDate === endDate ? (
                  <p className="font-normal text-sm text-center px-10">
                    {startDate}, {startTime} - {endTime}
                  </p>
                ) : (
                  <p className="font-normal text-[16px] text-center px-6 lg:px-4">
                    From {startDate} to {endDate}, <br />
                    {startTime} - {endTime}
                  </p>
                )}
              </div>
              <div className="my-5 space-x-5">
                <button
                  onClick={(e: React.MouseEvent<HTMLButtonElement>) =>
                    handleEdit(e)
                  }
                  className="custom-z-index-great px-3 py-3 bg-zinc-100 hover:bg-zinc-200 rounded-lg shadow-xl transition-all hover:shadow-xl font-light text-slate-600"
                >
                  Edit
                </button>
                <button
                  onClick={(e: React.MouseEvent<HTMLButtonElement>) =>
                    deleteEventOnServer(e, selectedEvent.event_id)
                  }
                  className="custom-z-index-great px-3 py-3 bg-zinc-100 hover:bg-zinc-200 rounded-lg shadow-xl transition-all hover:shadow-xl font-light text-slate-600"
                >
                  Delete
                </button>
                <button
                  // onClick={(e: React.MouseEvent<HTMLButtonElement>) =>
                  //   handleButtonClick(e)
                  // }
                  className="custom-z-index-great px-3 py-3 bg-zinc-100 hover:bg-zinc-200 rounded-lg shadow-xl transition-all hover:shadow-xl font-light text-slate-600"
                >
                  Archive
                </button>
              </div>
            </>
          ) : (
            ''
          )}

          {/* Code to display all events in a search bar */}

          {data.toLowerCase() === 'event' &&
          selectedEvent?.title !== 'event' ? (
            <ul className="mt-[2px]">
              {events.map((item) => (
                <li key={item.event_id}>
                  <button
                    onClick={(e: React.MouseEvent<HTMLButtonElement>) =>
                      handleEventChoose(e, item.event_id)
                    }
                    key={item.event_id}
                    className="w-[315px] md:w-screen overflow-scroll text-center hover:bg-slate-100 dark:hover:bg-gray-700 font-normal py-[6px] border-y border-zinc-100 dark:border-zinc-700 duration-300 transition-all"
                  >
                    {item.title}
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            ''
          )}
        </div>
      </form>
    </div>
  );
};

export default DynamicSearch;
