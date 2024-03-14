'use client';
import React from 'react';
import DynamicSearch from './DynamicSearch';

import { IoMenu } from 'react-icons/io5';

import { usePathname } from 'next/navigation';

const NavBar = () => {
  return (
    <>
      <nav className="flex dark:bg-gray-950 justify-center min-w-full h-20">
        <DynamicSearch />
      </nav>
    </>
  );
};

export default NavBar;
