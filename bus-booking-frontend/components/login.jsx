'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';

export default function Login() {
  const [form, setForm] = useState({ email: '', password: '' });
  const router = useRouter();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('http://localhost:5000/api/userActions/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(form),
      });

      if (!res.ok) throw new Error('Login failed');
      const data = await res.json();

      if (data.token && data.user) {
        Cookies.set('token', data.token, {
          expires: 7,
          path: '/',
          sameSite: 'Lax',
          secure: false,
        });
        localStorage.setItem('user', JSON.stringify(data.user));
        alert('Login successful!');
        if (data.user.role === 'admin') {
          router.push('/admin');
        } else {
          router.push('/home');
        }
      } else {
        throw new Error('Token or user info not received');
      }
    } catch (err) {
      alert(err.message || 'Something went wrong');
      console.error(err);
    }
  };

  return (
    <div className="auth-bg">
      <div className="auth-container">
        <div className="login-icon" aria-label="login"></div>
        <h2 className="login-title">Sign In</h2>
        <form onSubmit={handleSubmit} className="auth-form">
          <label htmlFor="email">Email</label>
          <input
            name="email"
            id="email"
            type="email"
            placeholder="Enter your email"
            onChange={handleChange}
            required
            value={form.email}
          />
          <label htmlFor="password">Password</label>
          <input
            name="password"
            id="password"
            type="password"
            placeholder="Enter your password"
            onChange={handleChange}
            required
            value={form.password}
          />
          <button type="submit">Login</button>
        </form>
      </div>
      <style jsx>{`
        .auth-bg {
          min-height: 100vh;
          background: linear-gradient(120deg, #e0e7ff 0%, #f0fdfa 100%);
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 40px 0;
        }
        .auth-container {
          max-width: 400px;
          width: 100%;
          margin: 0 auto;
          padding: 38px 32px 30px;
          border-radius: 18px;
          background: rgba(255,255,255,0.92);
          box-shadow: 0 8px 32px 0 rgba(37,99,235,0.10);
          backdrop-filter: blur(3px);
          font-family: 'Inter', 'Segoe UI', Arial, sans-serif;
        }
        .login-icon {
          font-size: 2.7rem;
          display: flex;
          justify-content: center;
          margin-bottom: 10px;
        }
        .login-title {
          text-align: center;
          font-size: 2rem;
          color: #2563eb;
          margin-bottom: 26px;
          font-weight: 700;
          letter-spacing: 0.5px;
        }
        .auth-form {
          display: flex;
          flex-direction: column;
          gap: 14px;
        }
        .auth-form label {
          font-weight: 600;
          color: #334155;
          margin-bottom: 3px;
          font-size: 1rem;
        }
        .auth-form input {
          padding: 13px 14px;
          border: 1.5px solid #dbeafe;
          border-radius: 9px;
          font-size: 1rem;
          background: #f8fafc;
          transition: border 0.2s;
          outline: none;
        }
        .auth-form input:focus {
          border: 1.5px solid #2563eb;
          background: #fff;
        }
        .auth-form button {
          margin-top: 15px;
          padding: 0.9rem 0;
          font-size: 1.1rem;
          border: none;
          border-radius: 9px;
          background: linear-gradient(90deg, #38bdf8 0%, #2563eb 100%);
          color: white;
          font-weight: 700;
          cursor: pointer;
          box-shadow: 0 2px 8px rgba(37, 99, 235, 0.09);
          transition: background 0.17s, box-shadow 0.17s;
          letter-spacing: 0.5px;
        }
        .auth-form button:hover {
          background: linear-gradient(90deg, #2563eb 0%, #38bdf8 100%);
          box-shadow: 0 4px 20px rgba(37,99,235,0.17);
        }
        @media (max-width: 600px) {
          .auth-container {
            padding: 18px 6vw 16px;
          }
        }
      `}</style>
    </div>
  );
}
