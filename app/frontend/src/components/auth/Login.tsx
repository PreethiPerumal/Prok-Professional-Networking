import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  
  // Always start with blank input boxes
  const [form, setForm] = useState({ usernameOrEmail: '', password: '' });
  const [apiError, setApiError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setApiError('');
    setSuccess('');
    setLoading(true);
    
    if (!form.usernameOrEmail || !form.password) {
      setLoading(false);
      return;
    }
    
    try {
      const res = await fetch('http://localhost:5000/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          usernameOrEmail: form.usernameOrEmail,
          password: form.password,
        }),
      });
      const data = await res.json();
      
      if (res.status === 200) {
        setSuccess('Login successful!');
        // Store the token (backend returns 'token', not 'access_token')
        if (data.token && data.user) {
          // Use AuthContext to manage authentication state
          login(data.token, data.user);
          // Redirect to profile page after successful login
          setTimeout(() => {
            navigate('/profile');
          }, 1000);
        } else {
          setApiError('No token or user data received from server.');
        }
      } else {
        setApiError(data.message || 'Login failed.');
      }
    } catch (err) {
      setApiError('Network error. Please check your connection.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f5f6f8] font-sans text-black">
      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-2xl shadow-md w-full max-w-md px-8 py-10 flex flex-col gap-6 mx-2"
        style={{ marginTop: '2rem', marginBottom: '2rem' }}
        autoComplete="off"
      >
        <h2 className="text-2xl font-bold text-center mb-2 text-black">Login</h2>
        <div className="flex flex-col gap-1">
          <label htmlFor="usernameOrEmail" className="text-sm font-medium text-black mb-1">
            Username or Email
          </label>
          <input
            id="usernameOrEmail"
            name="usernameOrEmail"
            type="text"
            autoComplete="new-username"
            value={form.usernameOrEmail}
            onChange={handleChange}
            className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-base bg-white text-black placeholder-gray-400"
            style={{ backgroundColor: 'white' }}
            disabled={loading}
          />
          <span className="text-xs text-red-500 min-h-[1.25rem] mt-1 block" style={{ minHeight: '1.25rem' }}>
            {!form.usernameOrEmail ? 'Username or Email is required.' : '\u00A0'}
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
            className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-base bg-white text-black placeholder-gray-400"
            style={{ backgroundColor: 'white' }}
            disabled={loading}
          />
          <span className="text-xs text-red-500 min-h-[1.25rem] mt-1 block" style={{ minHeight: '1.25rem' }}>
            {!form.password ? 'Password is required.' : '\u00A0'}
          </span>
        </div>
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-semibold py-2 rounded-md transition-colors text-base mt-2"
        >
          {loading ? 'Logging in...' : 'Login'}
        </button>
        {apiError && <div className="text-red-500 text-sm">{apiError}</div>}
        {success && <div className="text-green-600 text-sm">{success}</div>}
        <div className="text-center text-sm mt-2 text-black">
          Don't have an account?{' '}
          <Link to="/signup" className="text-blue-600 hover:underline font-medium">Signup</Link>
        </div>
      </form>
    </div>
  );
}

export default Login;