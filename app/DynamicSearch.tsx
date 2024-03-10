import React, { useEffect, useState } from 'react';
import { IoMdSearch } from 'react-icons/io';
import axios from 'axios';
import { useRouter } from 'next/router';

interface DynamicSearchProps {
  onSearch: (query: string) => void;
  events?: any;
}

const DynamicSearch = () => {
  const [data, setData] = useState('');
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [eventTitle, setEventTitle] = useState('');
  const [isSearchBarEmpty, setIsSearchBarEmpty] = useState(true);

  const getEvents = async () => {
    try {
      const response = await axios.get('api/events');

      if (response) return response;
    } catch (error) {
      console.log('Error fetching events:' + error);
    }
  };

  const handleInput = async (input: string) => {
    setData(input);

    if (input) setIsSearchBarEmpty(false);
    else setIsSearchBarEmpty(true);

    try {
      const response = await axios.get('/api/events');

      for (let i = 0; i < response.data.length; i++) {
        let e = response.data[i];

        if (e.title === input) {
          setSelectedEvent(e);
          setEventTitle(e.title);
          break;
        } else {
          setSelectedEvent(null);
          setEventTitle('');
        }
      }
    } catch (error) {
      return 'Error fetching event:' + error;
    }
  };

  useEffect(() => {
    console.log('Event:', selectedEvent);
  }, [selectedEvent]);

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
                ? 'bg-transparent'
                : 'shadow-lg active:border-2 hover:shadow-md active:shadow-lg dark:bg-gray-800'
            } rounded-xl md:w-72 text-top lg:w-96 pl-10 p-0.5 custom-z-index-great outline-none ease-in-out active:scale-y-105 transition-all duration-300 font-semibold`}
          />

          <button
            className={`custom-z-index-great ml-[10px] px-3 bg-slate-50 hover:bg-slate-100 hover:border active:bg-slate-200 dark:bg-gray-700 duration-300 transition-all rounded-lg shadow-lg hover:shadow-xl font-light text-slate-600 dark:text-slate-300`}
            type="submit"
          >
            Search
          </button>
        </div>

        <div
          className={`${
            selectedEvent || data.toLowerCase() === 'event'
              ? 'dynamic-search shadow-lg active:border-2 hover:shadow-md active:shadow-lg bg-white dark:bg-gray-800'
              : 'dynamic-search-reverse bg-transparent'
          } flex flex-col pt-8 justify-around items-center rounded-xl absolute md:w-72 text-top lg:w-96 p-0.5 custom-z-index ease-in-out active:scale-y-105 transition-all duration-300 font-semibold outline-none`}
        >
          <p className="font-mono">{selectedEvent ? eventTitle : ''}</p>

          {/* Code to display searched event delete and modify buttons */}

          {selectedEvent ? (
            <button className="custom-z-index-great px-3 py-3 bg-zinc-100 rounded-lg shadow-xl hover:shadow-xl font-light text-slate-600">
              Delete
            </button>
          ) : (
            ''
          )}

          {/* Code to display all events in a search bar */}

          {data.toLowerCase() === 'event' ? (
            <ul>
              <li>hi</li>
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
