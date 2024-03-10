'use client';

import axios from 'axios';
import Link from 'next/link';
import React from 'react';
import { useState } from 'react';

import { FaCheckCircle } from 'react-icons/fa';
import { MdOutlineError } from 'react-icons/md';
import { IoClose } from 'react-icons/io5';

const RegistrationPage: React.FC = () => {
  const [formData, setFormData] = useState<{
    name: string;
    email: string;
    password: string;
  }>({
    name: '',
    email: '',
    password: '',
  });

  const formContent = [
    { name: 'Name', type: 'name', data: formData.name, id: 0 },
    { name: 'Email', type: 'email', data: formData.email, id: 1 },
    { name: 'Password', type: 'password', data: formData.password, id: 2 },
  ];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const [successfullyRegistered, setSuccessfullyRegistered] = useState({});

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    try {
      e.preventDefault();

      const response = await axios.post('/api/register', formData);

      if (response.status === 200) {
        setSuccessfullyRegistered(true);
        setFormData({
          name: '',
          email: '',
          password: '',
        });
        return true;
      } else {
        setSuccessfullyRegistered(false);
        console.error('Unexpected response status:', response.status);
        return false;
      }
    } catch (error) {
      setSuccessfullyRegistered(false);
      console.error('Error adding user:', error);
      throw error;
    }
  };

  const handleErrorClose = () => {
    setSuccessfullyRegistered({});
  };

  return (
    <div className="flex flex-col min-w-full min-h-full pt-[100px] bg-neutral-200 items-center justify-center">
      {successfullyRegistered === true ? (
        <div className="flex space-x-5 items-center px-20 py-4 bg-lime-500 rounded-[40px]">
          <FaCheckCircle className="text-2xl transition-all" />
          <h2>Successfully registered!</h2>
        </div>
      ) : successfullyRegistered === false ? (
        <div className="flex space-x-5 items-center px-10 py-4 bg-red-400 rounded-[40px]">
          <MdOutlineError className="text-2xl transition-all" />
          <h2>You need to specify information to register.</h2>
          <button onClick={handleErrorClose}>
            <IoClose className="text-3xl" />
          </button>
        </div>
      ) : (
        ''
      )}

      <div className="flex flex-col items-center mt-[20px] px-9 h-[470px] mb-32 bg-white rounded-[40px] transition-all">
        <form className="pt-5" onSubmit={handleSubmit}>
          {formContent.map((item) => (
            <div key={item.id}>
              <p className="pt-1 pr-[140px] font-medium">{item.name}</p>

              <input
                className="bg-white pl-4 w-80 p-1 mt-0.5 rounded-md border border-gray-400"
                placeholder={item.name}
                type={item.type}
                key={item.id}
                name={item.type}
                value={item.data}
                onChange={handleChange}
              />
            </div>
          ))}
          <br />
          <button
            className=" p-2 w-full h-20 rounded-lg text-lg text-zinc-800 border-2 active:border border-gray-400 hover:bg-gray-100 transition-all"
            type="submit"
          >
            Sign up
          </button>
        </form>

        <div className="flex justify-center items-center h-[1px] my-6 w-full bg-zinc-300">
          <h3 className="bg-white px-1.5 text-zinc-400">
            already have an account?
          </h3>
        </div>

        <Link href="/api/auth/signin" className="w-full">
          <button className=" p-2 w-full h-20 rounded-lg text-lg text-zinc-800 border-2 active:border border-gray-400 hover:bg-gray-100 transition-all">
            Sign in to Verve
          </button>
        </Link>
      </div>
    </div>
  );
};

export default RegistrationPage;
