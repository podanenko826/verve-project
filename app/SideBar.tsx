import Link from 'next/link';
import React from 'react';
import { AiFillCarryOut } from 'react-icons/ai';

const SideBar = () => {
  return (
    <div className="flex w-[100px] items-center min-h-screen bg-gray-300 z-50 hover:w-[180px] transition-all hidden md:block duration-300">
      <Link href="/">
        <AiFillCarryOut className="text-[55px] pt-6" />
      </Link>
    </div>
  );
};

export default SideBar;
