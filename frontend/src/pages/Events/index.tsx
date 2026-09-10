import SideBar from '../../components/SideBar';
import NavBar from '../../components/NavBar';
import Scheduler from '../../components/Scheduler';

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
