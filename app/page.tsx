'use client';
import Link from 'next/link';
import { AiFillCarryOut } from 'react-icons/ai';

import { useSession } from 'next-auth/react';

export default function Home() {
  const navigation = [
    { label: 'Why Verve?', id: 0 },
    { label: 'Abous us', id: 1 },
  ];

  const { status, data: session } = useSession();

  return (
    <>
      <nav className="flex w-screen justify-between items-center bg-slate-300">
        <Link className="flex text-3xl p-5 pl-7" href="/">
          <AiFillCarryOut className="mt-0.5 pt-0.5" />
          <h1 className="font-light">Verve</h1>
        </Link>
        <div>
          {navigation.map((item) => (
            <Link
              key={item.id}
              href=""
              className="text-zinc-500 hover:text-zinc-700 transition-all bg-white px-7 py-1 font-semibold rounded-lg shadow-lg hover:shadow-sm duration-200 active:shadow-lg"
            >
              {item.label}
            </Link>
          ))}
        </div>
        <div>
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
                href="/Register"
                className="text-zinc-500 hover:text-zinc-700 transition-all bg-white px-7 py-1.5 font-semibold rounded-lg shadow-lg hover:shadow-sm duration-200 active:shadow-lg"
              >
                Sign up
              </Link>
            </>
          )}
        </div>
      </nav>
    </>
  );
}
