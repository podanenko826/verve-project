'use client';
import SideBar from '../SideBar';
import NavBar from '../NavBar';
import DashboardComponent from '../Dashboard';

export default function DashboardPage() {
  return (
    <>
      <div className="flex w-full">
        <div className="hidden md:block h-full">
          <SideBar />
        </div>
        <div className="flex flex-col items-center w-full">
          <NavBar />
          <DashboardComponent />
        </div>
      </div>
    </>
  );
}
