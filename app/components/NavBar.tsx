'use client';

import React, { use } from 'react';
import Link from 'next/link';

import { usePathname } from 'next/navigation';

// import { FcCalendar } from 'react-icons/fc';
import { FaFacebook, FaInstagramSquare } from 'react-icons/fa';

const NavBar = () => {
  const navigation = [
    { label: 'Dashboard', href: '/', id: 0 },
    { label: 'Events', href: '/Events', id: 1 },
  ];
  const currentPath = usePathname();

  console.log(currentPath);

  return (
    <>
      <nav className="flex justify-around items-center min-w-full p-6">
        <ul className="flex space-x-6">
          {navigation.map((item) => (
            <li key={item.id}>
              <Link
                href={item.href}
                className={`${
                  currentPath === item.href
                    ? 'text-black'
                    : 'text-zinc-500 hover:text-zinc-700'
                } transition-colors`}
              >
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
        <Link className="text-3xl first-letter:font-normal" href="/">
          {/* <FcCalendar /> */}
          <h1 className="font-light mr-20">Verve</h1>
        </Link>
        <ul className="flex text-3xl justify-center space-x-2">
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
        </ul>
      </nav>
    </>
  );
};

export default NavBar;
