'use client';
import React, { useEffect, useRef, useState } from 'react';
import DynamicSearch from './DynamicSearch';

import { IoMenu } from 'react-icons/io5';
import { FaUserCircle } from 'react-icons/fa';
import { IoSettingsOutline } from 'react-icons/io5';
import { MdOutlineAccountCircle } from 'react-icons/md';
import { GoSignOut } from 'react-icons/go';
import { RiDashboard2Line } from 'react-icons/ri';
import { RiCalendarEventLine } from 'react-icons/ri';
import { RiArchive2Line } from 'react-icons/ri';

import { usePathname } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import Link from 'next/link';

const NavBar = () => {
  const session = useSession();

  const [userMenuOpened, setUserMenuOpened] = useState<boolean>(false);

  const contextMenuRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      // Check if the click occurred outside of the context menu
      if (
        !target.closest('.context-menu') &&
        !target.closest('.context-menu-button')
      ) {
        setUserMenuOpened(false);
      }
    };

    document.addEventListener('click', handleClickOutside);

    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, []);

  const handleContextMenuClick = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    event.preventDefault();
    setUserMenuOpened(!userMenuOpened);
  };

  const currentPath = usePathname();

  const navigation = [
    {
      icon: <IoSettingsOutline />,
      label: 'Settings',
      href: '/settings',
      id: 0,
    },
    {
      icon: <MdOutlineAccountCircle />,
      label: 'Account',
      href: '/account',
      id: 1,
    },
    {
      icon: <RiArchive2Line />,
      label: 'Archive',
      href: '/events/archive',
      id: 2,
    },
    {
      icon: <GoSignOut />,
      label: 'Sign out',
      href: '/api/auth/signout',
      id: 3,
    },
  ];

  const mobileNavigation = [
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
    {
      icon: <RiArchive2Line />,
      label: 'Archive',
      href: '/events/archive',
      id: 4,
    },
    {
      icon: <GoSignOut />,
      label: 'Sign out',
      href: '/api/auth/signout',
      id: 5,
    },
  ];

  return (
    <>
      <nav className="flex albertsans dark:bg-gray-950 justify-between border-b-[1.5px] border-zinc-200 dark:border-zinc-900 mb-10 min-w-full h-20">
        <div className="w-full pl-5 flex justify-end">
          <DynamicSearch />
        </div>

        <div className="w-1/2 md:w-3/5 h-full text-[30px] mr-0 md:mr-7 flex justify-end items-start md:items-cente">
          <button
            className="context-menu-button mr-7 md:mr-0 h-1/2 mt-5 px-1 rounded-lg custom-z-index-greatest justify-self-center hover:bg-slate-200 active:bg-slate-400 dark:hover:bg-slate-600 dark:active:bg-slate-400"
            onClick={handleContextMenuClick}
            ref={contextMenuRef}
          >
            <FaUserCircle className="hidden md:block" />
            <IoMenu className="block md:hidden" />
          </button>

          {/* User context menu */}

          {session.status === 'authenticated' && userMenuOpened ? (
            <div className="context-menu py-4 space-y-4 w-full h-full overflow-scroll md:w-auto md:h-auto custom-z-index-greatest rounded-none md:rounded-xl shadow-lg mt-0 md:mt-20 bg-slate-50 dark:bg-slate-800 fixed">
              <div className="flex justify-between">
                <div>
                  <p className="text-[16px] pl-6 pr-16 font-medium">
                    {session.data?.user?.name}
                  </p>
                  <p className="text-[15px] text-slate-500 pl-6 pr-16 font-normal">
                    {session.data?.user?.email}
                  </p>
                </div>
                <div className="block md:hidden">
                  <button
                    className="mr-6 text-2xl px-2 p-1 rounded-xl hover:bg-slate-200 active:bg-slate-400 dark:hover:bg-slate-600 dark:active:bg-slate-400"
                    onClick={handleContextMenuClick}
                  >
                    ╳
                  </button>
                </div>
              </div>
              <div className="w-full text-[15px] border-t-[2px]">
                <ul className="hidden md:flex flex-col border-t-[0.5px] border-gray-100 dark:border-gray-950 pt-8 md:pt-5 space-y-4 text-center">
                  {navigation.map((item) =>
                    item.href !== currentPath ? (
                      <li key={item.id}>
                        <Link
                          href={item.href}
                          className="text-gray-500 hover:bg-zinc-100 dark:hover:bg-gray-700 active:bg-zinc-200 dark:active:bg-gray-400 rounded-lg transition-all ml-5 w-5/6 px-4 py-1.5 flex items-center text-[16px] duration-300"
                        >
                          <strong className="pr-1.5">{item.icon}</strong>
                          {item.label}
                        </Link>
                      </li>
                    ) : (
                      ''
                    )
                  )}
                </ul>
                <ul className="flex md:hidden flex-col border-t-[0.5px] border-gray-100 dark:border-gray-950 pt-8 md:pt-5 space-y-4 text-center">
                  {mobileNavigation.map((item) => (
                    <li key={item.id}>
                      <Link
                        href={item.href}
                        className="text-gray-500 hover:bg-zinc-100 dark:hover:bg-gray-700 active:bg-zinc-200 dark:active:bg-gray-400 rounded-lg transition-all ml-5 w-5/6 px-4 py-1.5 flex items-center text-[16px] duration-300"
                      >
                        <strong className="pr-1.5">{item.icon}</strong>
                        {item.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ) : (
            ''
          )}
        </div>
      </nav>
    </>
  );
};

export default NavBar;
