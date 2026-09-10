import { Link } from 'react-router-dom';
import { AiFillCarryOut } from 'react-icons/ai';


export default function Home() {
    const navigation = [
        { title: 'About us', id: 0 },
        { title: 'Why Verve?', id: 1 },
        { title: 'Contact', id: 2 },
    ];

    

    return (
        <>
            <nav className="flex w-screen px-[200px] justify-between items-center bg-gradient-home-navbar">
                <Link className="flex text-3xl text-white p-5 pl-7" to="/">
                    <AiFillCarryOut className="mt-0.5 pt-0.5" />
                    <h1 className="albertsans font-bold">Verve</h1>
                </Link>
                <div className="flex space-x-3">
                    <div className="flex">
                        {navigation.map((item) => (
                            <Link
                                key={item.id}
                                to=""
                                className="text-white hidden md:block text-md lg:text-lg hover:text-zinc-700 transition-all px-4 py-1 font-medium duration-200"
                            >
                                {item.title}
                            </Link>
                        ))}
                    </div>
                    <div className="flex">
                        {status === 'authenticated' ? (
                            <Link
                                to="/dashboard"
                                className="text-zinc-500 hover:text-zinc-700 transition-all bg-white px-4 py-1.5 font-semibold rounded-lg shadow-lg hover:shadow-sm duration-200 active:shadow-lg"
                            >
                                Member area
                            </Link>
                        ) : (
                            <>
                                <Link
                                    to="/register"
                                    className="text-zinc-500 hover:text-zinc-700 transition-all bg-white px-4 py-1 font-semibold rounded-lg shadow-lg hover:shadow-sm duration-200 active:shadow-lg"
                                >
                                    Sign up
                                </Link>
                            </>
                        )}
                    </div>
                </div>
            </nav>

            <div className="flex flex-col space-y-1 px-[250px] pt-24">
                <h1 className="text-xl md:text-2xl lg:text-3xl font-extralight text-gray-500">
                    Manage events like never before.
                </h1>
                <h1 className="font-light text-[40px] md:text-[60px] lg:text-[80px] text-gray-500">
                    Verve.
                </h1>
            </div>
            <div className="px-[250px] pt-10">
                <Link
                    to="/register"
                    className="uppercase font-medium text-zinc-500 text-center hover:text-zinc-700 transition-all bg-gray-100 px-8 py-2.5 rounded-lg shadow-lg hover:shadow-sm duration-200 active:shadow-lg"
                >
                    Get Started (free) →
                </Link>
            </div>

            <div className="flex flex-col items-center space-y-1 px-[250px] pt-28">
                <h1 className="font-normal text-[42px] text-gray-500">About us</h1>
            </div>
        </>
    );
}
