'use client';
import React, { useState } from 'react';
import SideBar from '../SideBar';
import NavBar from '../NavBar';
import axios from 'axios';

export default function SettingsPage() {
  const [newPassword, setNewPassword] = useState<string>('');
  const [currentPassword, setCurrentPassword] = useState<string>('');
  const [showPassword, setShowPassword] = useState<boolean>(false);

  const handleCurrentPasswordChange = (value: any) => {
    setCurrentPassword(value);
  };

  const handleNewPasswordChange = (value: string) => {
    setNewPassword(value);
  };

  const toggleShowPassword = () => {
    setShowPassword((prevShowPassword) => !prevShowPassword);
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    const response = await axios.post('/api/update-password', {
      currentPassword,
      newPassword,
    });
  };

  return (
    <>
      <div className="flex w-full albertsans">
        <div className="hidden md:block h-full">
          <SideBar />
        </div>
        <div className="flex flex-col w-full">
          <NavBar />
          <div className="flex flex-col items-center">
            <h1 className="text-4xl ml-16 self-start">Settings</h1>

            <div className="flex flex-col mt-10 w-5/6 justify-center rounded-[25px] border bg-white dark:bg-slate-800">
              <h1 className="text-xl pl-6 pt-6">Password</h1>
              <h2 className="text-slate-500 text-[14px] p-6 border-b-[0.5px] font-normal uppercase">
                Update password
              </h2>
              <div className="flex">
                <form
                  className="flex flex-col p-8 mt-4 space-y-5 border-b-[0.5px]"
                  action="post"
                  onSubmit={(e) => handleSubmit(e)}
                >
                  <div className="flex">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      className="w-1/2 rounded-lg dark:text-black h-10 pl-3"
                      placeholder="Current password"
                      onChange={(e) =>
                        handleCurrentPasswordChange(e.target.value)
                      }
                      value={currentPassword}
                    />
                    <div className="flex ml-5 items-center space-x-4">
                      <label htmlFor="show-password">Show Password</label>
                      <input
                        className="w-4 h-4"
                        type="checkbox"
                        onChange={toggleShowPassword}
                      />
                    </div>
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    className="w-1/2 rounded-lg dark:text-black h-10 pl-3 border-b-[0.5px]"
                    placeholder="New password"
                    onChange={(e) => handleNewPasswordChange(e.target.value)}
                    value={newPassword}
                  />
                  <button
                    className="w-26 self-end p-3 my-3 mr-8 rounded-xl text-start bg-slate-500"
                    type="submit"
                  >
                    Update
                  </button>
                </form>
                {/* <form action="post" className="w-[200px] h-[100px] bg-black">
                  <div className="flex">
                    <input type="text" />
                  </div>
                </form> */}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
