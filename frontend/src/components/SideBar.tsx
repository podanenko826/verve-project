import { Link, useLocation } from 'react-router-dom';
import { useState } from 'react';
import { AiFillCarryOut } from 'react-icons/ai';

import { RiDashboard2Line } from 'react-icons/ri';
import { RiCalendarEventLine } from 'react-icons/ri';
import { IoSettingsOutline } from 'react-icons/io5';
import { MdOutlineAccountCircle } from 'react-icons/md';
import { FaHeart } from 'react-icons/fa6';
import { FaExternalLinkAlt } from 'react-icons/fa';

const SideBar = () => {
    const navigation = [
        {
            icon: <RiDashboard2Line />,
            label: 'Dashboard',
            href: '/dashboard',
            id: 0,
        },
        {
            icon: <RiCalendarEventLine />,
            label: 'Events',
            href: '/events',
            id: 1,
        },
        {
            icon: <IoSettingsOutline />,
            label: 'Settings',
            href: '/settings',
            id: 2,
        },
        {
            icon: <MdOutlineAccountCircle />,
            label: 'Account',
            href: '/account',
            id: 3,
        },
    ];

    const location = useLocation();
    const currentPath = location.pathname;

    
    const [selectedOption, setSelectedOption] = useState('option1');

    const handleOptionChange = (event: any) => {
        setSelectedOption(event.target.value);
    };

    return (
        <nav className="flex flex-col justify-between albertsans bg-gradient-sidebar dark:bg-gradient-sidebar-dark pb-10 w-[260px] min-h-screen space-y-10 shadow-2xl z-50 transition-all duration-300 overflow-hidden">
            <div>
                <div className="space-y-5 p-6 flex flex-col">
                    <Link className="flex text-3xl text-white" to="/">
                        <AiFillCarryOut className="mt-0.5 pt-0.5" />
                        <h1 className="albertsans font-bold">Verve</h1>
                    </Link>

                    <div className="rounded-2xl border border-zinc-400 px-3 py-0.5">
                        <h3 className="py-0.5 text-zinc-300 text-[15px]">Workspace</h3>
                        <select
                            className="w-full text-white bg-transparent outline-none pb-1"
                            value={selectedOption}
                            onChange={handleOptionChange}
                        >
                            <option value="option1">Personal</option>
                            <option value="option2">Business</option>
                        </select>
                    </div>
                </div>
                <ul className="flex md:flex-col border-t-[1px] border-gray-400 pt-10 pb-28 space-y-4 text-center">
                    {navigation.map((item) => (
                        <li key={item.id}>
                            <Link
                                to={item.href}
                                className={`${currentPath === item.href
                                    ? 'text-gray-200 dark:bg-blue-400 shadow-shadow-sidebar'
                                    : 'text-gray-400 hover:text-gray-200'
                                    } transition-all px-6 py-3 flex items-center text-[16px] duration-200`}
                            >
                                <strong className="pr-1.5">{item.icon}</strong>
                                {item.label}
                            </Link>
                        </li>
                    ))}
                </ul>
            </div>

            <div className="flex flex-col justify-end items-center w-full h-min">
                <div className="flex text-gray-200">
                    <h1>Made with</h1>
                    <FaHeart className="text-red-600 mt-1 ml-1.5" />
                    <h1 className="ml-1.5">by</h1>
                </div>
                <Link
                    to={'https://twitter.com/denys_podanenko'}
                    target="_blank"
                    className="flex text-gray-200"
                >
                    <h1>Denys Podanenko</h1>
                    <FaExternalLinkAlt className="mt-1 ml-1.5" />
                </Link>
            </div>
        </nav>
    );
};

export default SideBar;
