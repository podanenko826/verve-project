'use client';

import React, { use } from 'react';
import Link from 'next/link';

import { usePathname } from 'next/navigation';

import { FaRegCalendarCheck } from 'react-icons/fa';

const NavBar = () => {
  const navigation = [
    { label: 'Dashboard', href: '/', id: 0 },
    { label: 'Events', href: '/Events', id: 1 },
  ];

  const currentPath = usePathname();

  console.log(currentPath);

  return (
    <>
      <nav className="flex min-w-full space-x-10 pl-10 bg-slate-100 p-6">
        <Link className="text-2xl" href="/">
          <FaRegCalendarCheck />
        </Link>
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
      </nav>
    </>
  );
};

export default NavBar;
