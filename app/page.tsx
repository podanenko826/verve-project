'use client';
import Link from 'next/link';
import { AiFillCarryOut } from 'react-icons/ai';

import { useSession } from 'next-auth/react';

export default function Home() {
  const navigation = [
    { title: 'Why Verve?', id: 0 },
    { title: 'About us', id: 1 },
    { title: 'Contact', id: 2 },
  ];

  const { status, data: session } = useSession();

  return (
    <>
      <nav className="flex w-screen justify-between items-center bg-gradient-home-navbar">
        <Link className="flex text-3xl text-white p-5 pl-7" href="/">
          <AiFillCarryOut className="mt-0.5 pt-0.5" />
          <h1 className="font-light">Verve</h1>
        </Link>
        <div className="flex space-x-16">
          <div className="flex">
            {navigation.map((item) => (
              <Link
                key={item.id}
                href=""
                className="text-white hidden md:block text-md lg:text-lg hover:text-zinc-700 transition-all px-4 py-1 font-medium duration-200"
              >
                {item.title}
              </Link>
            ))}
          </div>
          <div className="flex">
            {status === 'authenticated' ? (
              <Link
                href="/dashboard"
                className="text-zinc-500 hover:text-zinc-700 transition-all bg-white px-7 py-1.5 font-semibold rounded-lg shadow-lg hover:shadow-sm duration-200 active:shadow-lg"
              >
                Member area
              </Link>
            ) : (
              <>
                <Link
                  href="/register"
                  className="text-zinc-500 hover:text-zinc-700 transition-all bg-white px-7 py-1 font-semibold rounded-lg shadow-lg hover:shadow-sm duration-200 active:shadow-lg"
                >
                  Sign up
                </Link>
              </>
            )}
          </div>
        </div>
      </nav>

      <div className="flex flex-col bg-gradient-home-content1 pl-5 md:pl-10 lg:pl-20 py-16">
        <h1 className="text-xl md:text-2xl lg:text-3xl font-extralight text-gray-300">
          Manage events like never before.
        </h1>
        <h1 className="font-light text-[40px] md:text-[60px] lg:text-[80px] text-white">
          Verve.
        </h1>
      </div>
    </>
  );
}
