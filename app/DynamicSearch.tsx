'use client';
import React, { useEffect, useRef, useState } from 'react';
import { IoMdSearch } from 'react-icons/io';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { enUS } from 'date-fns/locale';
import { format } from 'date-fns';
import Link from 'next/link';

import { ImCross } from 'react-icons/im';
import { PiWarningOctagonFill } from 'react-icons/pi';
import { MdOutlineDone } from 'react-icons/md';
import { MdDelete } from 'react-icons/md';
import { RiArchive2Fill } from 'react-icons/ri';
import { ProcessedEvent } from '@aldabil/react-scheduler/types';

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
  const [eventSearchFailed, setEventSearchFailed] = useState<boolean>(false);
  const [eventDeleted, setEventDeleted] = useState<boolean>(false);
  const [eventArchived, setEventArchived] = useState<boolean>(false);
  const [unexpectedProblem, setUnexpectedProblem] = useState<boolean>(false);

  const [searchOpened, setSearchOpened] = useState<boolean>(false);

  const dynamicSearchRef = useRef<HTMLLabelElement>(null);

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

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      // Check if the click occurred outside of the context menu
      if (!target.closest('.dynamic-search')) {
        setSearchOpened(false);
      }
    };

    document.addEventListener('click', handleClickOutside);

    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, []);

  const refetchData = async () => {
    try {
      const response = await axios.get('/api/events');

      setEvents(response.data);
    } catch (error) {
      console.error('Error fetching event:', error);
    }
  };

  const handleDynamicSearchClick = () => {
    setSearchOpened(!searchOpened);

    refetchData();
  };

  async function deleteEventOnServer(
    event: React.MouseEvent<HTMLButtonElement>,
    deletedId: any
  ) {
    event.preventDefault();

    if (!deletedId) {
      setUnexpectedProblem(true);
      setTimeout(() => {
        setEventSearchFailed(false);
      }, 4200);
      return false;
    }

    try {
      const response = await axios.delete(`/api/events/${deletedId}`);

      if (response.status === 200) {
        setEventDeleted(true);
        setTimeout(() => {
          setEventDeleted(false);
        }, 4200);
        setData('');
        setSelectedEvent(undefined);
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
    event: React.MouseEvent<HTMLButtonElement>,
    archivedId: any
  ) {
    event.preventDefault();

    if (!archivedId) {
      setUnexpectedProblem(true);
      setTimeout(() => {
        setEventSearchFailed(false);
      }, 4200);
    }

    const updatedData = {
      ...selectedEvent,
      status:
        selectedEvent!.status === Status.OPEN ? Status.CLOSED : Status.OPEN,
    };

    // setSelectedEvent(updatedData);

    try {
      console.log(updatedData);
      const updatedEvent = await updateEventOnServer(archivedId, updatedData);

      setEventArchived(true);
      setTimeout(() => {
        setEventArchived(false);
      }, 4200);

      setData('');
      setSelectedEvent(undefined);

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

  const handleInput = async (input: string) => {
    setData(input);

    if (input) setIsSearchBarEmpty(false);
    else setIsSearchBarEmpty(true);

    if (input.toLowerCase() !== 'event') {
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

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (data) {
      for (const event of events) {
        if (data === event.title) {
          window.location.href = `/events?event_id=${event.event_id}`;
          return;
        }
      }
    }

    setEventSearchFailed(true);
    setTimeout(() => {
      setEventSearchFailed(false);
    }, 4200);
    setSearchOpened(false);
  };

  return (
    <div>
      <form
        onSubmit={handleSubmit}
        autoComplete="off"
        className={`${
          eventSearchFailed ||
          eventDeleted ||
          eventArchived ||
          unexpectedProblem
            ? 'mr-[250px] md:mr-[375px] albertsans'
            : ''
        } flex z-50 mt-6`}
      >
        <div onClick={handleDynamicSearchClick} className="dynamic-search flex">
          <label
            htmlFor="search"
            ref={dynamicSearchRef}
            className={`${
              eventSearchFailed ||
              eventDeleted ||
              eventArchived ||
              unexpectedProblem
                ? 'hidden'
                : ''
            }`}
          >
            <IoMdSearch className="text-3xl fill-slate-400 absolute pl-2 custom-z-index-greater" />
          </label>
          {!eventSearchFailed &&
            !eventDeleted &&
            !eventArchived &&
            !unexpectedProblem && (
              <input
                type="search"
                id="search"
                name="search"
                value={data}
                onChange={(e) => handleInput(e.target.value)}
                className={`${
                  searchOpened ||
                  eventSearchFailed ||
                  eventDeleted ||
                  eventArchived ||
                  unexpectedProblem
                    ? 'bg-transparent rounded-t-xl'
                    : 'shadow-lg active:border-2 hover:shadow-md active:shadow-lg dark:bg-gray-800 rounded-xl'
                } w-40 md:w-72 text-top max-w-96 pl-10 p-0.5 custom-z-index-great outline-none ease-in-out active:scale-y-105 transition-all duration-500`}
              />
            )}
          {!eventSearchFailed &&
            !eventDeleted &&
            !eventArchived &&
            !unexpectedProblem && (
              <button
                className={`dynamic-search custom-z-index-great ml-[10px] px-3 bg-slate-50 dark:bg-gray-700 hover:bg-slate-100 dark:hover:bg-slate-600 hover:border active:bg-slate-200 active:scale-x-105 dark:active:bg-slate-800 duration-500 transition-all rounded-lg shadow-lg hover:shadow-xl text-slate-600 dark:text-slate-300`}
                onClick={handleDynamicSearchClick}
                type="submit"
              >
                Search
              </button>
            )}
        </div>

        <div
          className={`${
            searchOpened ||
            eventSearchFailed ||
            eventDeleted ||
            eventArchived ||
            unexpectedProblem
              ? 'shadow-lg md:active:border-2 hover:shadow-md active:shadow-lg bg-white dark:bg-gray-800'
              : ' bg-transparent'
          } ${
            eventSearchFailed ||
            eventDeleted ||
            eventArchived ||
            unexpectedProblem
              ? ''
              : 'pt-[26px]'
          }
          dynamic-search overflow-x-auto flex flex-col justify-around items-center rounded-xl absolute w-[245px] max-h-[330px] text-top md:w-96 p-0.5 custom-z-index ease-in-out transition-all duration-500 albertsans outline-none`}
        >
          {/* Code to display searched event delete and modify buttons */}

          {searchOpened &&
          selectedEvent &&
          !eventSearchFailed &&
          !eventDeleted &&
          !eventArchived &&
          !unexpectedProblem ? (
            <>
              <div className="flex flex-col items-center w-full">
                <p>{selectedEvent ? eventTitle : ''}</p>
                {startDate === endDate ? (
                  <p className="text-sm text-center px-10">
                    {startDate}, {startTime} - {endTime}
                  </p>
                ) : (
                  <p className="text-[16px] text-center px-6 lg:px-4">
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
                  className="custom-z-index-great px-3 py-3 bg-zinc-50 dark:bg-zinc-600 hover:bg-zinc-100 dark:hover:bg-zinc-500 active:bg-zinc-200 dark:active:bg-zinc-400 rounded-[4.5px] transition-all text-black dark:text-white"
                >
                  Edit
                </button>
                <button
                  onClick={(e: React.MouseEvent<HTMLButtonElement>) =>
                    deleteEventOnServer(e, selectedEvent.event_id)
                  }
                  className="custom-z-index-great px-3 py-3 bg-zinc-50 dark:bg-zinc-600 hover:bg-zinc-100 dark:hover:bg-zinc-500 active:bg-zinc-200 dark:active:bg-zinc-400 rounded-[4.5px] transition-all text-black dark:text-white"
                >
                  Delete
                </button>
                <button
                  onClick={(e: React.MouseEvent<HTMLButtonElement>) =>
                    archiveEventOnServer(e, selectedEvent.event_id)
                  }
                  className="custom-z-index-great px-3 py-3 bg-zinc-50 dark:bg-zinc-600 hover:bg-zinc-100 dark:hover:bg-zinc-500 active:bg-zinc-200 dark:active:bg-zinc-400 rounded-[4.5px] transition-all text-black dark:text-white"
                >
                  Archive
                </button>
              </div>
            </>
          ) : (
            ''
          )}

          {/* Code to display all events in a search bar */}

          {searchOpened && !eventTitle && !eventSearchFailed ? (
            <ul className="mt-[2px]">
              {events.map((item) => (
                <li key={item.event_id}>
                  <button
                    onClick={(e: React.MouseEvent<HTMLButtonElement>) =>
                      handleEventChoose(e, item.event_id)
                    }
                    key={item.event_id}
                    className="dynamic-search w-[250px] md:w-[380px] overflow-scroll text-center hover:bg-slate-100 dark:hover:bg-gray-700 font-normal py-[6px] border-y border-zinc-100 dark:border-zinc-700 duration-300 transition-all"
                  >
                    {item.title}
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            ''
          )}

          {/* Code to display various errors in a search bar */}

          {eventSearchFailed && (
            <div className="flex space-x-5 py-[22px] transition-all">
              {data && eventSearchFailed ? (
                <>
                  <ImCross className="text-red-600 text-xl" />
                  <h1 className="font-medium">Event does not exist</h1>
                </>
              ) : (
                <>
                  <PiWarningOctagonFill className="text-yellow-500 text-2xl" />
                  <h1 className="font-medium">Event name is required</h1>
                </>
              )}
            </div>
          )}

          {eventDeleted && (
            <div className="flex space-x-5 py-[22px] transition-all">
              <MdDelete className="text-red-400 text-2xl" />
              <h1 className="font-medium">Event deleted successfully</h1>
            </div>
          )}

          {eventArchived && (
            <div className="flex space-x-5 py-[22px] transition-all">
              <RiArchive2Fill className="text-slate-400 text-xl" />
              <h1 className="font-medium">Event archived successfully</h1>
            </div>
          )}

          {unexpectedProblem && (
            <div className="flex space-x-5 py-[22px] transition-all">
              <ImCross className="text-red-600 text-xl" />
              <h1 className="font-medium">Something went wrong</h1>
            </div>
          )}
        </div>
      </form>
    </div>
  );
};

export default DynamicSearch;
