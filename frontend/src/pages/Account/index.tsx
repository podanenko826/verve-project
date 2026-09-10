import React from 'react';
import SideBar from '../../components/SideBar';
import NavBar from '../../components/NavBar';
import { FaUserCircle } from 'react-icons/fa';

export default async function AccountPage() {

    // const currentUser = allUsers.filter;

    return (
        <>
            <div className="flex w-full">
                <div className="hidden md:block h-full">
                    <SideBar />
                </div>
                <div className="flex flex-col w-full">
                    <NavBar />
                    <div className="flex flex-col mx-16">
                        <p className="text-3xl">Account</p>
                        <div className="flex flex-col items-center justify-around mt-8 bg-white w-[450px] border-[1.5px] rounded-[25px]">
                            <div className="flex flex-col items-center">
                                {/* {currentUser?.image ? (
                                    <img
                                        src={currentUser?.image!}
                                        referrerPolicy="no-referrer"
                                        alt=""
                                        className="w-20 h-20 mt-6 rounded-full"
                                        draggable={false}
                                    />
                                ) : (
                                    <FaUserCircle className="text-[70px]" />
                                )} */}
                                {/* <p className="text-2xl mt-4">{currentUser?.name}</p> */}
                                <p className="text-lg mt-4 text-slate-400">Account ID:</p>
                                {/* <p className="text-sm text-slate-500">{currentUser?.id}</p> */}
                            </div>
                            <div className="flex justify-center border-t-[1.5px] w-full mt-5 overflow-hidden">
                                <button className="w-full py-5 rounded-b-[25px] text-blue-500 active:text-blue-300 hover:bg-gray-50 duration-100 transition-all">
                                    Upload picture
                                </button>
                                <input type="file" className="upload-picture hidden" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
