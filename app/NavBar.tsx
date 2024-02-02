'use client';
import React from 'react';
import DynamicSearch from './DynamicSearch';

import { usePathname } from 'next/navigation';

const NavBar = () => {
  return (
    <>
      <nav className="flex justify-around min-w-full h-20">
        <DynamicSearch />
      </nav>
    </>
  );
};

export default NavBar;
