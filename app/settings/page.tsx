import React from 'react';
import SideBar from '../SideBar';
import NavBar from '../NavBar';

export default function SettingsPage() {
  return (
    <>
      <div className="flex w-full">
        <div className="hidden md:block h-full">
          <SideBar />
        </div>
        <div className="flex flex-col w-full">
          <NavBar />
          <div className="flex flex-col items-center">
            <h1 className="text-4xl ml-16 self-start">Settings</h1>

            <div className="flex flex-col mt-10 w-5/6 justify-center rounded-[25px] border bg-white dark:bg-slate-800">
              <h1 className="text-xl pl-6 pt-6">Password</h1>
              <h2 className="text-slate-500 text-[14px] p-6 border-b-[0.5px] font-normal uppercase">
                Update password
              </h2>
              <form
                className="flex flex-col p-8 mt-4 space-y-5 border-b-[0.5px]"
                action="post"
              >
                <input
                  type="text"
                  className="w-1/2 rounded-lg dark:text-black h-10 pl-3"
                  placeholder="New password"
                />
                <input
                  type="text"
                  className="w-1/2 rounded-lg dark:text-black h-10 pl-3 border-b-[0.5px]"
                  placeholder="Repeat new password"
                />
              </form>
              <button
                className="w-26 self-end p-3 my-3 mr-8 rounded-xl text-start bg-slate-500"
                type="submit"
              >
                Update
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
