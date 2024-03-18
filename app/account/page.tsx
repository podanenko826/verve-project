import React from 'react';
import SideBar from '../SideBar';
import NavBar from '../NavBar';

export default function AccountPage() {
  return (
    <>
      <div className="flex w-full">
        <div className="hidden md:block h-full">
          <SideBar />
        </div>
        <div className="flex flex-col items-center w-full">
          <NavBar />
          <p>AccountPage</p>
        </div>
      </div>
    </>
  );
}
