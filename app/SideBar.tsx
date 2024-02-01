import Link from 'next/link';
import React from 'react';
import { AiFillCarryOut } from 'react-icons/ai';

const SideBar = () => {
  return (
    <div className="flex flex-col w-[100px] items-center min-h-full bg-gray-300 z-50 hover:w-[180px] transition-all duration-300">
      <Link href="/">
        <AiFillCarryOut className="text-3xl mt-6" />
      </Link>
    </div>
  );
};

export default SideBar;
