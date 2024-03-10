'use client';
import SideBar from '../SideBar';
import NavBar from '../NavBar';

export default function DashboardPage() {
  return (
    <>
      <div className="flex w-screen">
        <div>
          <SideBar />
        </div>
        <div className="w-screen">
          <NavBar />
          <p>Dashboard</p>
        </div>
      </div>
    </>
  );
}
