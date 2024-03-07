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
  const [event, setEvent] = useState({});
  let isSearchEmpty = true;
  const [eventTitle, setEventTitle] = useState('');

  const handleInput = async (input: string) => {
    setData(input);

    if (!data) isSearchEmpty = true;
    else isSearchEmpty = false;

    try {
      const response = await axios.get('/api/events');

      for (let i = 0; i < response.data.length; i++) {
        let e = response.data[i];

        if (e.title === input) {
          setEvent(e);
          setEventTitle(e.title);
          break;
        } else {
          setEvent('');
          setEventTitle('');
        }
      }
    } catch (error) {
      return 'Error fetching event:' + error;
    }
  };

  useEffect(() => {
    console.log('Event:', event);
  }, [event]);

  return (
    <div>
      <form className="flex z-50 mt-6">
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
            event
              ? 'bg-transparent'
              : 'shadow-lg active:border-2 hover:shadow-md active:shadow-lg'
          } rounded-xl md:w-72 text-top lg:w-96 pl-10 p-0.5 dark:bg-gray-800 custom-z-index-great outline-none ease-in-out active:scale-y-105 transition-all duration-300 font-semibold`}
        />
        <div
          className={`${
            event
              ? 'dynamic-search shadow-lg active:border-2 hover:shadow-md active:shadow-lg bg-white'
              : 'dynamic-search-reverse bg-transparent'
          } flex pt-8 justify-center rounded-xl absolute md:w-72 text-top lg:w-96 p-0.5 dark:bg-gray-800 custom-z-index ease-in-out active:scale-y-105 transition-all duration-300 font-semibold outline-none`}
        >
          <p className="font-mono">{event ? eventTitle : ''}</p>
        </div>
        {isSearchEmpty && (
          <button
            className="absolute custom-z-index-great ml-[305px] mt-0.5 px-3 bg-slate-50 rounded-lg shadow-lg hover:shadow-xl font-light text-slate-600"
            type="submit"
          >
            Search
          </button>
        )}
      </form>
    </div>
  );
};

export default DynamicSearch;
