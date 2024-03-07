'use client';

import axios from 'axios';
import React from 'react';
import { useState } from 'react';

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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    try {
      e.preventDefault();

      const response = await axios.post('/api/register', formData);

      if (response.status === 200) {
        return true;
      } else {
        console.error('Unexpected response status:', response.status);
        return false;
      }
    } catch (error) {
      console.error('Error adding user:', error);
      throw error;
    }
  };

  return (
    <div className="flex min-w-full min-h-full items-center justify-center">
      <div className="flex flex-col items-center px-10 h-96 mb-32 bg-white shadow-2xl rounded-xl">
        <form className="pt-5" onSubmit={handleSubmit}>
          <p className="pt-3 pr-[140px]">Name</p>
          <input
            className="bg-white pl-3 w-80 p-0.5 mt-2 rounded-md border border-gray-400"
            placeholder="Name"
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
          />
          <p className="pt-3 pr-[140px]">Email</p>
          <input
            className="bg-white pl-3 w-80 p-0.5 mt-2 rounded-md border border-gray-400"
            placeholder="Email"
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
          />
          <p className="pt-3 pr-[140px]">Password</p>
          <input
            className="bg-white pl-3 w-80 p-0.5 mt-2 rounded-md border border-gray-400"
            placeholder="Password"
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
          />
          <br />
          <button
            className="mt-5 p-2 w-full h-20 rounded-lg border border-gray-400 hover:bg-gray-100 transition-all"
            type="submit"
          >
            Sign up
          </button>
        </form>
      </div>
    </div>
  );
};

export default RegistrationPage;
