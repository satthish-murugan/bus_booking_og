'use client';

import { useState } from 'react';
import api from '../utils/api';
import RequireAuth from '@/components/RequireAuth';
import Layout from '@/components/layout';

export default function BookingForm() {
  const [form, setForm] = useState({
    passengername: '',
    busnumber: '',
    seatnumber: '',
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post('/', form); // ✅ cookies will be sent
      alert('Booking successful!');
      setForm({ passengername: '', busnumber: '', seatnumber: '' });
    } catch (err) {
      console.error(err.response?.data || err.message);
      alert('Booking failed');
    }
  };

  return (
    <RequireAuth>
      <Layout>
        <div className="booking-container">
          <style>{`
            .booking-container {
              max-width: 400px;
              margin: 50px auto;
              padding: 30px;
              background: #ffffff;
              border-radius: 10px;
              box-shadow: 0 4px 12px rgba(0,0,0,0.1);
              font-family: Arial, sans-serif;
            }
            .booking-container h2 {
              text-align: center;
              margin-bottom: 20px;
              color: #333;
            }
            .booking-form input {
              width: 100%;
              padding: 12px;
              margin-bottom: 15px;
              border: 1px solid #ccc;
              border-radius: 6px;
              font-size: 16px;
            }
            .booking-form button {
              width: 100%;
              padding: 12px;
              background-color: #007bff;
              color: white;
              border: none;
              border-radius: 6px;
              font-size: 16px;
              cursor: pointer;
              font-weight: bold;
            }
            .booking-form button:hover {
              background-color: #0056b3;
            }
          `}</style>

          <h2>Bus Seat Booking</h2>
          <form onSubmit={handleSubmit} className="booking-form">
            <input
              type="text"
              name="passengername"
              placeholder="Passenger Name"
              value={form.passengername}
              onChange={handleChange}
              required
            />
            <input
              type="text"
              name="busnumber"
              placeholder="Bus Number"
              value={form.busnumber}
              onChange={handleChange}
              required
            />
            <input
              type="text"
              name="seatnumber"
              placeholder="Seat Number"
              value={form.seatnumber}
              onChange={handleChange}
              required
            />
            <button type="submit">Book Now</button>
          </form>
        </div>
      </Layout>
    </RequireAuth>
  );
}
