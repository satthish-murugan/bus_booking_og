'use client';

import React, { useState, useEffect } from 'react';
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
        credentials: 'include', // make sure CORS allows this
        body: JSON.stringify(form),
      });

      if (!res.ok) throw new Error('Login failed');
      const data = await res.json();

      if (data.token) {
        // ✅ Ensure cookie is set with path so it works after reload
        Cookies.set('token', data.token, {
          expires: 7,
          path: '/',         // 👈 crucial to persist it across routes
          sameSite: 'Lax',   // recommended setting
          secure: false,     // set to true if using HTTPS
        });

      

        alert('Login successful!');
        router.push('/home');
      } else {
        throw new Error('Token not received');
      }
    } catch (err) {
      alert(err.message || 'Something went wrong');
      console.error(err);
    }
  };


  return (
    <div className="auth-container">
      <h2>Login</h2>
      <form onSubmit={handleSubmit} className="auth-form">
        <input
          name="email"
          type="email"
          placeholder="Email"
          onChange={handleChange}
          required
          value={form.email}
        />
        <input
          name="password"
          type="password"
          placeholder="Password"
          onChange={handleChange}
          required
          value={form.password}
        />
        <button type="submit">Login</button>
      </form>

      <style jsx>{`
        .auth-container {
          max-width: 450px;
          margin: 60px auto;
          background: white;
          padding: 30px;
          border-radius: 10px;
          box-shadow: 0 5px 20px rgba(0, 0, 0, 0.1);
          font-family: 'Segoe UI', sans-serif;
        }
        .auth-form input {
          display: block;
          width: 100%;
          padding: 10px;
          margin-bottom: 15px;
          border: 1px solid #ccc;
          border-radius: 6px;
        }
        .auth-form button {
          width: 100%;
          background-color: #007bff;
          color: white;
          padding: 10px;
          border: none;
          border-radius: 6px;
          cursor: pointer;
          font-weight: bold;
        }
        .auth-form button:hover {
          background-color: #0056b3;
        }
      `}</style>
    </div>
  );
}
