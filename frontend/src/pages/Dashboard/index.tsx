import SideBar from '../../components/SideBar';
import NavBar from '../../components/NavBar';
import DashboardComponent from '../../components/Dashboard';

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
