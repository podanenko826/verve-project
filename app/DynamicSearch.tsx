'use client';
import React, { useEffect, useRef, useState } from 'react';
import { IoMdSearch } from 'react-icons/io';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { enUS } from 'date-fns/locale';
import { format } from 'date-fns';
import { ProcessedEvent } from '@aldabil/react-scheduler/types';

import { ImCross } from 'react-icons/im';
import { PiWarningOctagonFill } from 'react-icons/pi';
import { MdOutlineDone } from 'react-icons/md';
import { MdDelete } from 'react-icons/md';
import { RiArchive2Fill } from 'react-icons/ri';
import { GoDotFill } from 'react-icons/go';
import { GoDot } from 'react-icons/go';
import { IoIosSearch } from 'react-icons/io';
import { useSession } from 'next-auth/react';

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
  const [nearestEvents, setNearestEvents] = useState<Event[]>([]);
  const [eventTitle, setEventTitle] = useState('');
  const [isSearchBarEmpty, setIsSearchBarEmpty] = useState(true);
  const [pageChosen, setPageChosen] = useState<string>('allEvents');
  const [events, setEvents] = useState<Event[]>([]);
  // const [eventSearchFailed, setEventSearchFailed] = useState<boolean>(false);
  // const [eventDeleted, setEventDeleted] = useState<boolean>(false);
  // const [eventArchived, setEventArchived] = useState<boolean>(false);
  // const [unexpectedProblem, setUnexpectedProblem] = useState<boolean>(false);
  const [message, setMessage] = useState<string>('');

  const [searchOpened, setSearchOpened] = useState<boolean>(false);

  const dynamicSearchRef = useRef<HTMLLabelElement>(null);

  const router = useRouter();

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const response = await axios.get('/api/events');

        setEvents(response.data);
        getNearestEvents();
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

      console.log('refetching');

      getNearestEvents();
      let e: Event[] = [];

      if (data) {
        for (let i = 0; i < response.data.length; i++) {
          if (
            response.data[i].title[0].toLowerCase() === data[0].toLowerCase()
          ) {
            e.push(response.data[i]);
          }
        }
        setEvents(e);
      } else {
        setEvents(response.data);
      }
    } catch (error) {
      console.error('Error fetching event:', error);
    }
  };

  const getNearestEvents = async () => {
    if (events.length) {
      const differences = events.map((event) =>
        Math.abs(
          new Date().getTime() -
            (event.start instanceof Date ? event.start.getTime() : event.start)
        )
      );

      events.sort((a, b) => {
        const diffA = Math.abs(
          new Date().getTime() -
            (a.start instanceof Date
              ? a.start.getTime()
              : new Date(a.start).getTime())
        );
        const diffB = Math.abs(
          new Date().getTime() -
            (b.start instanceof Date
              ? b.start.getTime()
              : new Date(b.start).getTime())
        );
        return diffA - diffB; // Sorting in ascending order
      });

      setNearestEvents(events.slice(0, 3));
    }
  };

  async function deleteEventOnServer(
    event: React.MouseEvent<HTMLButtonElement>,
    deletedId: any
  ) {
    event.preventDefault();

    if (!deletedId) {
      setMessage('unexpected');
      setTimeout(() => {
        setMessage('');
      }, 4200);
      return false;
    }

    try {
      const response = await axios.delete(`/api/events/${deletedId}`);

      if (response.status === 200) {
        setMessage('deleted');
        setTimeout(() => {
          setMessage('');
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
      setMessage('unexpected');
      setTimeout(() => {
        setMessage('');
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

      setMessage('archived');
      setTimeout(() => {
        setMessage('');
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

    getNearestEvents();

    try {
      const response = await axios.get('/api/events');

      let e: Event[] = [];

      if (input) {
        setSearchOpened(true);

        for (let i = 0; i < response.data.length; i++) {
          if (
            response.data[i].title[0].toLowerCase() === input[0].toLowerCase()
          ) {
            e.push(response.data[i]);
          }
          setEvents(e);
        }
      } else {
        setSearchOpened(false);
      }

      for (let i = 0; i < response.data.length; i++) {
        let e = response.data[i];

        if (e.title.toLowerCase() === input.toLowerCase()) {
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

  const handleDetails = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();

    router.push('/events/details/' + selectedEvent?.event_id);
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

    setMessage('searchFailed');
    setTimeout(() => {
      setMessage('');
    }, 4200);
    setSearchOpened(false);
  };

  const handleDynamicSearchClick = () => {
    // setSearchOpened(false);
    // setSearchOpened(true);
    setSearchOpened(!searchOpened);

    refetchData();
  };

  const handlePageChange = (
    event: React.MouseEvent<HTMLButtonElement>,
    page: string
  ) => {
    event.preventDefault();

    setPageChosen(page);
  };
  const session = useSession();

  return (
    <div>
      <form
        onSubmit={handleSubmit}
        autoComplete="off"
        className={`${
          message !== '' ? 'mr-[250px] md:mr-[375px] albertsans' : ''
        } flex z-50 mt-6`}
      >
        <div onClick={handleDynamicSearchClick} className="dynamic-search flex">
          <button
            type="submit"
            className={`${message !== '' ? 'hidden' : ''} ${
              searchOpened ? 'rounded-tl-[10px]' : 'rounded-l-[10px]'
            } mb-[30px] absolute w-9 h-8 hover:bg-slate-200 text-zinc-300 hover:text-zinc-400 duration-200 custom-z-index-greatest transition-all`}
          >
            <IoMdSearch className="text-[25px] ml-2 mb " />
          </button>
          {message === '' && (
            <input
              type="search"
              id="search"
              name="search"
              value={data}
              onChange={(e) => handleInput(e.target.value)}
              placeholder={searchOpened ? '' : 'Search'}
              className={`${
                message !== '' || searchOpened
                  ? 'rounded-t-xl'
                  : 'shadow-lg hover:shadow-sm active:border-2 hover:border-[0.5px] active:shadow-lg dark:bg-gray-800 rounded-xl'
              } w-40 md:w-72 lg:w-[350px] text-top border-1 bg-white opacity-80 max-w-[350px] pl-10 p-1 outline-none custom-z-index-greater ease-in-out active:scale-y-105 transition-all duration-500`}
            />
          )}
          {/* {!eventSearchFailed &&
            !eventDeleted &&
            !eventArchived &&
            !unexpectedProblem && (
              <button
                className={`dynamic-search custom-z-index-greater absolute ml-[170px] text-[15px] shadow-lg md:ml-[248px] lg:ml-[279px] mt-0.5 px-2.5 py-0.5 bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-slate-600 active:bg-slate-200 dark:active:bg-slate-800 duration-500 transition-all rounded-xl text-slate-600 dark:text-slate-300`}
                onClick={handleDynamicSearchClick}
                type="submit"
              >
                Search
              </button>
            )} */}
        </div>

        <>
          <div
            className={`${
              message !== '' || searchOpened
                ? 'shadow-lg hover:shadow-md active:shadow-lg bg-white dark:bg-gray-800'
                : 'bg-transparent'
            } ${message !== '' ? 'h-[76px]' : 'pt-[26px]'}
                dynamic-search overflow-x-auto flex flex-col justify rounded-xl items-center absolute w-[245px] h-[217px] text-top md:w-[350px] p-0.5 custom-z-index-great ease-in-out transition-all duration-500 albertsans outline-none`}
          >
            {/* Max height 330px */}
            {/* Code to display searched event delete and modify buttons */}

            {searchOpened && selectedEvent && message === '' ? (
              <>
                <div className="flex flex-col items-center mt-4 w-full">
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
                      handleDetails(e)
                    }
                    className="custom-z-index-great px-3 py-3 bg-zinc-50 dark:bg-zinc-600 hover:bg-zinc-100 dark:hover:bg-zinc-500 active:bg-zinc-200 dark:active:bg-zinc-400 rounded-[4.5px] transition-all text-black dark:text-white"
                  >
                    Details
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
            {events.length &&
            searchOpened &&
            pageChosen === 'allEvents' &&
            !eventTitle &&
            message === '' ? (
              <ul className="mt-[2px] ease-in-out">
                <h1 className="font-bold py-2 w-full text-center">
                  {!events[0] && data && 'Event does not exist'}
                  {data !== '' && events[0] !== null ? '' : 'All events'}
                </h1>
                {events.map((item) => (
                  <li key={item.event_id}>
                    <button
                      onClick={(e: React.MouseEvent<HTMLButtonElement>) =>
                        handleEventChoose(e, item.event_id)
                      }
                      key={item.event_id}
                      className="dynamic-search ease-in-out w-[250px] md:w-[346px] overflow-scroll text-center hover:bg-slate-100 dark:hover:bg-gray-700 font-normal py-[10px] border-y border-zinc-100 dark:border-zinc-700 duration-300 transition-all"
                    >
                      {item.title}
                    </button>
                  </li>
                ))}
              </ul>
            ) : (
              ''
            )}

            {events.length &&
            searchOpened &&
            pageChosen === 'nearestEvent' &&
            !eventTitle &&
            message === '' ? (
              <ul className="items-center smt-[2px]">
                <h1 className="font-bold py-2 w-full text-center">
                  Nearest events
                </h1>
                {nearestEvents.map((item) => (
                  <li key={item.event_id}>
                    <button
                      onClick={(e: React.MouseEvent<HTMLButtonElement>) =>
                        handleEventChoose(e, item.event_id)
                      }
                      className="dynamic-search w-[250px] md:w-[346px] overflow-scroll text-center hover:bg-slate-100 dark:hover:bg-gray-700 font-normal py-[10px] border-y border-zinc-100 dark:border-zinc-700 duration-300 transition-all"
                    >
                      {item.title} -{' '}
                      {format(new Date(item.start), 'd MMMM yyyy h:mm', {
                        locale: enUS,
                      })}
                    </button>
                  </li>
                ))}
              </ul>
            ) : (
              ''
            )}

            {/* Code to display various errors in a search bar */}

            {message !== '' && (
              <div className="flex space-x-5 py-[22px] ease-in-out transition-all">
                {data && message === 'searchFailed' ? (
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

            {message === 'deleted' && (
              <div className="flex space-x-5 py-[22px] ease-in-out transition-all">
                <MdDelete className="text-red-400 text-2xl" />
                <h1 className="font-medium">Event deleted successfully</h1>
              </div>
            )}

            {message === 'archived' && (
              <div className="flex space-x-5 py-[22px] ease-in-out transition-all">
                <RiArchive2Fill className="text-slate-400 text-xl" />
                <h1 className="font-medium">Event archived successfully</h1>
              </div>
            )}

            {message === 'unexpected' && (
              <div className="flex space-x-5 py-[22px] ease-in-out transition-all">
                <ImCross className="text-red-600 text-xl" />
                <h1 className="font-medium">Something went wrong</h1>
              </div>
            )}
          </div>
          {searchOpened && (
            <div
              className={`${
                message === ''
                  ? 'shadow-lg hover:shadow-md active:shadow-lg bg-white dark:bg-gray-800'
                  : ' bg-transparent'
              }
                dynamic-search overflow-x-auto flex flex-col justify-around items-center rounded-b-xl mt-52 absolute w-[245px] text-top md:w-[350px] p-0.5 custom-z-index-great ease-in-out transition-all duration-500 albertsans outline-none`}
            >
              {searchOpened && message === '' ? (
                <div className="flex justify-center space-x-1 py-2">
                  <button
                    onClick={(e: React.MouseEvent<HTMLButtonElement>) =>
                      handlePageChange(e, 'allEvents')
                    }
                    className="text-xl hover:scale-110 duration-150"
                  >
                    {/* {pageChosen === 'allEvents' ? <GoDotFill /> : <GoDot />} */}
                    <GoDotFill />
                  </button>
                  <button
                    onClick={(e: React.MouseEvent<HTMLButtonElement>) =>
                      handlePageChange(e, 'nearestEvent')
                    }
                    className="text-xl hover:scale-110 duration-150"
                  >
                    {/* {pageChosen === 'nearestEvent' ? (
                        <GoDotFill />
                      ) : (
                        <GoDot />
                      )} */}
                    <GoDotFill />
                  </button>
                </div>
              ) : (
                ''
              )}
            </div>
          )}
        </>
      </form>
    </div>
  );
};

export default DynamicSearch;
