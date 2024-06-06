import React from 'react';
import SideBar from '../SideBar';
import NavBar from '../NavBar';
import { getServerSession } from 'next-auth';
import axios from 'axios';
import { PrismaClient } from '@prisma/client';
import { useSession } from 'next-auth/react';

export default async function AccountPage() {
  const prisma = new PrismaClient();
  const session = await getServerSession();

  const currentUser = await prisma.user.findUnique({
    where: {
      email: session?.user.email!,
    },
  });
  // const currentUser = allUsers.filter;

  return (
    <>
      <div className="flex w-full">
        <div className="hidden md:block h-full">
          <SideBar />
        </div>
        <div className="pl-6 flex-col w-full">
          <NavBar />
          <p className="text-3xl">Account</p>
          <div className="flex flex-col items-center justify-around mt-8 bg-white w-[450px] h-[330px] border-[1.5px] rounded-[25px]">
            <div className="flex flex-col items-center">
              <img
                src={currentUser?.image!}
                referrerPolicy="no-referrer"
                alt="pfp"
                className="w-20 h-20 mt-6 rounded-full"
                draggable={false}
              />
              <p className="text-2xl mt-4">{currentUser?.name}</p>
              <p className="text-lg mt-4 text-slate-400">Account ID:</p>
              <p className="text-sm text-slate-500">{currentUser?.id}</p>
            </div>
            <div className="flex justify-center border-t-[1.5px] w-full pt-4">
              <button className="text-blue-500 active:text-blue-300 active:border-blue-300 border-blue-500 hover:border-b-[0.5px] duration-100 transition-all">
                Upload picture
              </button>
              <input type="file" className="upload-picture hidden" />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
