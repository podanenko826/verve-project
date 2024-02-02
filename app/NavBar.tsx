'use client';

import React, { use } from 'react';
import Link from 'next/link';

import { usePathname } from 'next/navigation';

// import { FcCalendar } from 'react-icons/fc';
import { FaFacebook, FaInstagramSquare } from 'react-icons/fa';
import { AiFillCarryOut } from 'react-icons/ai';
import { IoMdSearch } from 'react-icons/io';

const NavBar = () => {
  return (
    <>
      <nav className="flex justify-around items-center min-w-full h-20">
        <form className="flex">
          <label htmlFor="search">
            <IoMdSearch className="text-3xl fill-slate-400 absolute pl-2 z-50" />
          </label>
          <input
            type="search"
            id="search"
            name="q"
            placeholder=""
            className="rounded-xl w-96 pl-10 p-0.5 shadow-lg hover:shadow-md transition-all active:shadow-lg active:scale-y-105 duration-300 font-semibold outline-none active:border-2"
          />
          {/* <button type="submit">Search</button> */}
        </form>
      </nav>
    </>
  );
};

export default NavBar;
