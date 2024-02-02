'use client';
import Link from 'next/link';
import React from 'react';
import { AiFillCarryOut } from 'react-icons/ai';
import { usePathname } from 'next/navigation';

import { FaFacebook, FaInstagramSquare } from 'react-icons/fa';

const SideBar = () => {
  const navigation = [
    { label: 'Dashboard', href: '/', id: 0 },
    { label: 'Events', href: '/Events', id: 1 },
    { label: 'Login', href: '/api/auth/signin', id: 2 },
  ];

  const currentPath = usePathname();

  return (
    <nav className="w-[170px] min-h-screen space-y-10 bg-sidebar shadow-2xl z-50 transition-all hidden md:block duration-300">
      <Link className="flex text-3xl pt-7 pl-7" href="/">
        <AiFillCarryOut className="mt-0.5 pt-0.5" />
        <h1 className="font-light">Verve</h1>
      </Link>
      <ul className="flex flex-col items-center text-center space-y-2">
        {navigation.map((item) => (
          <li key={item.id}>
            <Link
              href={item.href}
              className={`${
                currentPath === item.href
                  ? 'text-black'
                  : 'text-zinc-500 hover:text-zinc-700'
              } transition-all bg-white px-3 py-1 rounded-xl shadow-xl hover:shadow-sm duration-200 active:shadow-lg`}
            >
              {item.label}
            </Link>
          </li>
        ))}
      </ul>
      <ul className="flex text-3xl justify-center w-40 space-x-2 ">
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
  );
};

export default SideBar;
