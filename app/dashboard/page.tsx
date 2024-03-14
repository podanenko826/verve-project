'use client';
import SideBar from '../SideBar';
import NavBar from '../NavBar';

export default function DashboardPage() {
  return (
    <>
      <div className="flex w-full">
        <div className="hidden md:block h-full">
          <SideBar />
        </div>
        <div className="w-full">
          <NavBar />
          <p>Dashboard</p>
        </div>
      </div>
    </>
  );
}
