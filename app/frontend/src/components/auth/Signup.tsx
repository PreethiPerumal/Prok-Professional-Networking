import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const Signup: React.FC = () => {
  const [form, setForm] = useState({
    username: '',
    email: '',
    password: '',
    confirm_password: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.username || !form.email || !form.password || !form.confirm_password) {
      return;
    }
    if (form.password.length < 8) {
      return;
    }
    if (form.password !== form.confirm_password) {
      return;
    }
    // TODO: Add signup API call here
    alert('Signup submitted!');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f5f6f8] font-sans text-black">
      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-2xl shadow-md w-full max-w-md px-8 py-10 flex flex-col gap-6 mx-2"
      >
        <h2 className="text-2xl font-bold text-center mb-2 text-black">Sign Up</h2>
        <div className="flex flex-col gap-1">
          <label htmlFor="username" className="text-sm font-medium text-black mb-1">
            Username
          </label>
          <input
            id="username"
            name="username"
            type="text"
            autoComplete="username"
            value={form.username}
            onChange={handleChange}
            className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-base bg-white text-black"
          />
          <span className="text-xs text-red-500 min-h-[1.25rem] mt-1">
            {!form.username ? 'Username is required.' : '\u00A0'}
          </span>
        </div>
        <div className="flex flex-col gap-1">
          <label htmlFor="email" className="text-sm font-medium text-black mb-1">
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            value={form.email}
            onChange={handleChange}
            className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-base bg-white text-black"
          />
          <span className="text-xs text-red-500 min-h-[1.25rem] mt-1">
            {!form.email ? 'Email is required.' : '\u00A0'}
          </span>
        </div>
        <div className="flex flex-col gap-1">
          <label htmlFor="password" className="text-sm font-medium text-black mb-1">
            Password
          </label>
          <input
            id="password"
            name="password"
            type="password"
            autoComplete="new-password"
            value={form.password}
            onChange={handleChange}
            className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-base bg-white text-black"
          />
          <span className="text-xs text-red-500 min-h-[1.25rem] mt-1">
            {!form.password
              ? 'Password is required.'
              : form.password.length < 8
              ? 'Password must be at least 8 characters.'
              : '\u00A0'}
          </span>
        </div>
        <div className="flex flex-col gap-1">
          <label htmlFor="confirm_password" className="text-sm font-medium text-black mb-1">
            Confirm Password
          </label>
          <input
            id="confirm_password"
            name="confirm_password"
            type="password"
            autoComplete="new-password"
            value={form.confirm_password}
            onChange={handleChange}
            className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-base bg-white text-black"
          />
          <span className="text-xs text-red-500 min-h-[1.25rem] mt-1">
            {!form.confirm_password
              ? 'Please confirm your password.'
              : form.password !== form.confirm_password
              ? 'Passwords do not match.'
              : '\u00A0'}
          </span>
        </div>
        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-md transition-colors text-base mt-2"
        >
          Signup
        </button>
        <div className="text-center text-sm mt-2 text-black">
          Already have an account?{' '}
          <Link to="/login" className="text-blue-600 hover:underline font-medium">Login</Link>
        </div>
      </form>
    </div>
  );
};

export default Signup;