'use client';
import SideBar from '../SideBar';
import NavBar from '../NavBar';
import Scheduler from '@/app/Scheduler';

export default function EventsPage() {
  return (
    <>
      <div className="flex w-screen">
        <div>
          <SideBar />
        </div>
        <div className="w-screen">
          <NavBar />
          <Scheduler />
        </div>
      </div>
    </>
  );
}
