import React from 'react';
import { IoMdSearch } from 'react-icons/io';

const DynamicSearch = () => {
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
          placeholder=""
          className="rounded-xl md:w-72 lg:w-96 pl-10 p-0.5 custom-z-index shadow-lg dynamic-search ease-in-out active:scale-y-105 hover:shadow-md transition-all active:shadow-lg duration-300 font-semibold outline-none active:border-2"
        />
        {/* <button type="submit">Search</button> */}
      </form>
    </div>
  );
};

export default DynamicSearch;
