'use client';
import Link from 'next/link';
import React, { useState } from 'react';
import { AiFillCarryOut } from 'react-icons/ai';
import { usePathname } from 'next/navigation';
import { useSession } from 'next-auth/react';

import { FaFacebook, FaInstagramSquare } from 'react-icons/fa';
import { MdKeyboardDoubleArrowRight } from 'react-icons/md';
import { RiDashboard2Line } from 'react-icons/ri';
import { RiCalendarEventLine } from 'react-icons/ri';
import { IoSettingsOutline } from 'react-icons/io5';
import { MdOutlineAccountCircle } from 'react-icons/md';

const SideBar = () => {
  const navigation = [
    {
      icon: <RiDashboard2Line />,
      label: 'Dashboard',
      href: '/dashboard',
      id: 0,
    },
    {
      icon: <RiCalendarEventLine />,
      label: 'Events',
      href: '/events',
      id: 1,
    },
    {
      icon: <IoSettingsOutline />,
      label: 'Settings',
      href: '/settings',
      id: 2,
    },
    {
      icon: <MdOutlineAccountCircle />,
      label: 'Account',
      href: '/account',
      id: 3,
    },
  ];

  const currentPath = usePathname();

  const { status, data: session } = useSession();

  const [selectedOption, setSelectedOption] = useState('option1');

  const handleOptionChange = (event: any) => {
    setSelectedOption(event.target.value);
  };

  return (
    <nav className="flex flex-col bg-gradient-sidebar dark:bg-gradient-sidebar-dark pb-10 w-[250px] min-h-screen space-y-10 shadow-2xl z-50 transition-all duration-300 overflow-hidden">
      <div className="space-y-5 pt-7 flex flex-col items-center justify-between">
        <Link className="flex text-3xl pr-20 text-white" href="/">
          <AiFillCarryOut className="mt-0.5 pt-0.5" />
          <h1 className="font-light hidden md:block">Verve</h1>
        </Link>

        <div className="w-5/6 rounded-2xl border border-zinc-400">
          <h3 className="pl-3 py-0.5 text-zinc-300 text-[15px]">Workspace</h3>
          <select
            className="w-[200px] text-white bg-transparent outline-none pl-2 pb-1"
            value={selectedOption}
            onChange={handleOptionChange}
          >
            <option value="option1">Personal</option>
            <option value="option2">Business</option>
          </select>
        </div>
      </div>
      <ul className="flex md:flex-col border-t-[1.5px] border-gray-400 pt-10 pb-28 space-y-4 text-center">
        {navigation.map((item) => (
          <li key={item.id}>
            <Link
              href={item.href}
              className={`${
                currentPath === item.href
                  ? 'text-gray-200 bg-blue-400 rounded-lg'
                  : 'text-gray-400 hover:text-gray-200'
              } transition-all ml-5 w-5/6 px-4 py-1.5 flex items-center text-[16px] duration-200`}
            >
              <strong className="pr-1.5">{item.icon}</strong>
              {item.label}
            </Link>
          </li>
        ))}
      </ul>

      {/* <ul className="flex md:flex-col justify-center items-center text-center">
        {status === 'unauthenticated' && (
          <div className=" flex flex-col space-y-2">
            <Link
              className="transition-all bg-white dark:text-black px-10 py-1 font-semibold rounded-lg shadow-lg hover:shadow-sm duration-200 active:shadow-lg"
              href="/api/auth/signin"
            >
              Sign in
            </Link>
            <Link
              className="transition-all bg-white dark:text-black py-1 font-semibold rounded-lg shadow-lg hover:shadow-sm duration-200 active:shadow-lg"
              href="/register"
            >
              Sign up
            </Link>
          </div>
        )}
        {status === 'authenticated' && (
          <div className="flex flex-col items-center space-y-2">
            <p className="font-semibold text-[15px] text-white overflow-hidden">
              {session.user?.name}
            </p>
            <Link
              className="transition-all bg-white dark:text-black px-5 py-1 font-semibold rounded-lg shadow-lg hover:shadow-sm duration-200 active:shadow-lg"
              href="/api/auth/signout"
            >
              Sign out
            </Link>
          </div>
        )}
      </ul> */}
      {/* <ul className="flex text-3xl justify-center w-40 space-x-2 ">
        <li>
          <Link href="#">
            <FaInstagramSquare />
          </Link>
        </li>
        <li>
          <Link href="#">
            <FaFacebook />
          </Link>
        </li>
      </ul> */}

      {/* <button className="text-[50px]">
        <MdKeyboardDoubleArrowRight />
      </button> */}
    </nav>
  );
};

export default SideBar;
