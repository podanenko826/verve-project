'use client';

import React, { use } from 'react';
import Link from 'next/link';

import { usePathname } from 'next/navigation';

// import { FcCalendar } from 'react-icons/fc';
import { FaFacebook, FaInstagramSquare } from 'react-icons/fa';
import { AiFillCarryOut } from 'react-icons/ai';

const NavBar = () => {
  const navigation = [
    { label: 'Dashboard', href: '/', id: 0 },
    { label: 'Events', href: '/Events', id: 1 },
    { label: 'Login', href: '/api/auth/signin', id: 2 },
  ];
  const currentPath = usePathname();

  console.log(currentPath);

  return (
    <>
      <nav className="flex justify-around items-center min-w-full h-20">
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
        <Link className="flex text-3xl" href="/">
          <AiFillCarryOut className="mt-0.5 pt-0.5" />
          <h1 className="font-light">Verve</h1>
        </Link>
        <ul className="flex text-3xl justify-center w-40 space-x-2">
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
