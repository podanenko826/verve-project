'use client';
import Link from 'next/link';
import React from 'react';
import { AiFillCarryOut } from 'react-icons/ai';
import { usePathname } from 'next/navigation';
import { useSession } from 'next-auth/react';

import { FaFacebook, FaInstagramSquare } from 'react-icons/fa';
import { MdKeyboardDoubleArrowRight } from 'react-icons/md';
import { RiDashboard2Line } from 'react-icons/ri';
import { RiCalendarEventLine } from 'react-icons/ri';

const SideBar = () => {
  // const navigation = [
  //   {
  //     label: <RiDashboard2Line />,
  //     href: '/dashboard',
  //     id: 0,
  //   },
  //   { label: <RiCalendarEventLine />, href: '/events', id: 1 },
  // ];

  const currentPath = usePathname();

  const { status, data: session } = useSession();

  return (
    <nav className="flex flex-col items-center dark:bg-gradient-sidebar-dark justify-around pb-10 w-[30px] md:w-[150px] max-w-[170px] min-h-screen space-y-10 shadow-2xl z-50 transition-all duration-300 overflow-hidden">
      <Link className="flex text-3xl" href="/">
        <AiFillCarryOut className="mt-0.5 pt-0.5" />
        <h1 className="font-light hidden md:block">Verve</h1>
      </Link>
      <ul className="flex md:flex-col justify-center space-y-4 items-center text-center">
        {/* {navigation.map((item) => (
          <li key={item.id}>
            <Link
              href={item.href}
              className={`${
                currentPath === item.href ? '' : ''
              } transition-all text-gray-200 hover:text-gray-400 w-20 h-20 text-[20px] hover:shadow-sm duration-200 active:shadow-lg`}
            >
              {item.label}
            </Link>
          </li>
        ))} */}
        <li>
          <Link
            href="/dashboard"
            className={`${
              currentPath === '/dashboard'
                ? 'text-gray-200'
                : 'text-gray-400 hover:text-gray-200'
            } transition-all flex items-center text-[19px] hover:shadow-sm duration-200 active:shadow-lg`}
          >
            <RiDashboard2Line /> Dashboard
          </Link>
        </li>
        <li>
          <Link
            href="/events"
            className={`${
              currentPath === '/events'
                ? 'text-gray-200'
                : 'text-gray-400 hover:text-gray-200'
            } transition-all flex items-center text-[19px] hover:shadow-sm duration-200 active:shadow-lg`}
          >
            <RiCalendarEventLine /> Events
          </Link>
        </li>
        <li></li>
      </ul>

      <ul className="flex md:flex-col justify-center items-center text-center">
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
              href="/Register"
            >
              Sign up
            </Link>
          </div>
        )}
        {status === 'authenticated' && (
          <div className="flex flex-col items-center space-y-2">
            <p className="font-semibold text-[15px] overflow-hidden">
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
      </ul>
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
