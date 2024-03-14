'use client';
import SideBar from '../SideBar';
import NavBar from '../NavBar';
import Scheduler from '@/app/Scheduler';

export default function EventsPage() {
  return (
    <>
      <div className="flex h-full">
        <div className="hidden md:block h-full">
          <SideBar />
        </div>
        <div className="w-full">
          <NavBar />
          <Scheduler />
        </div>
      </div>
    </>
  );
}
