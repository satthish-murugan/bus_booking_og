'use client';

import { useState } from 'react';
import { useRouter } from 'next/router';
import api from '../utils/api';
import RequireAuth from '@/components/RequireAuth';
import Layout from '@/components/layout';

function addBookedSeats(busId, seats) {
  if (typeof window === 'undefined') return;
  const prev = JSON.parse(localStorage.getItem(`bookedSeats_${busId}`) || '[]');
  const updated = Array.from(new Set([...prev, ...seats]));
  localStorage.setItem(`bookedSeats_${busId}`, JSON.stringify(updated));
}

export default function BookingForm() {
  const router = useRouter();
  const { busNumber, busId, seats } = router.query;
  const [form, setForm] = useState({
    passengername: '',
    age: '',
    gender: '',
    phone: '',
    traveldate: '',
  });
  const [loading, setLoading] = useState(false);

  const selectedSeats = seats ? seats.split(',').map(Number) : [];

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post('/', {
        ...form,
        busnumber: busNumber,
        busid: busId,
        seatnumber: selectedSeats.join(','),
        traveldate: form.traveldate,
      });
      addBookedSeats(busId, selectedSeats);
      router.push('/BookingList');
    } catch (err) {
      alert('Booking failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (!busNumber || !busId || !seats) {
    return (
      <RequireAuth>
        <Layout>
          <div style={{ textAlign: 'center', marginTop: 40 }}>
            <h2>Invalid booking request</h2>
            <p>Please select a bus and seats from the available buses page.</p>
          </div>
        </Layout>
      </RequireAuth>
    );
  }

  return (
    <RequireAuth>
      <Layout>
        <div className="booking-form-outer">
          <div className="booking-form-card">
            <h2 className="booking-title">Book Your Ticket</h2>
            <form onSubmit={handleSubmit} className="booking-form">
              <div className="info-row">
                <div>
                  <label className="info-label">Bus Number:</label>
                  <span className="info-value">{busNumber}</span>
                </div>
                <div>
                  <label className="info-label">Seats:</label>
                  <span className="info-value">{selectedSeats.join(', ')}</span>
                </div>
              </div>
              <div className="form-group">
                <input
                  type="text"
                  id="passengername"
                  name="passengername"
                  value={form.passengername}
                  onChange={handleChange}
                  required
                  className="form-input"
                  autoComplete="off"
                />
                <label htmlFor="passengername" className="form-label">Passenger Name</label>
              </div>
              <div className="form-group">
                <input
                  type="number"
                  id="age"
                  name="age"
                  value={form.age}
                  onChange={handleChange}
                  required
                  className="form-input"
                  min="1"
                  max="120"
                />
                <label htmlFor="age" className="form-label">Age</label>
              </div>
              <div className="form-group">
                <select
                  id="gender"
                  name="gender"
                  value={form.gender}
                  onChange={handleChange}
                  required
                  className="form-input"
                >
                  <option value="" disabled>Select</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
                <label htmlFor="gender" className="form-label">Gender</label>
              </div>
              <div className="form-group">
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={form.phone}
                  onChange={handleChange}
                  required
                  className="form-input"
                  pattern="[0-9]{10,}"
                  maxLength={15}
                />
                <label htmlFor="phone" className="form-label">Phone</label>
              </div>
              <div className="form-group">
                <input
                  type="date"
                  id="traveldate"
                  name="traveldate"
                  value={form.traveldate}
                  onChange={handleChange}
                  required
                  className="form-input"
                />
                <label htmlFor="traveldate" className="form-label">Travel Date</label>
              </div>
              <button type="submit" disabled={loading} className="booking-btn">
                {loading ? 'Booking...' : 'Book Now'}
              </button>
            </form>
          </div>
        </div>
        <style jsx>{`
          .booking-form-outer {
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            background: linear-gradient(120deg, #e0eafc 0%, #cfdef3 100%);
            padding: 32px 0;
          }
          .booking-form-card {
            background: #fff;
            border-radius: 1.2rem;
            box-shadow: 0 8px 32px rgba(60, 60, 120, 0.13);
            padding: 2.5rem 2rem 2rem 2rem;
            max-width: 420px;
            width: 100%;
            margin: auto;
            transition: box-shadow 0.2s;
          }
          .booking-title {
            text-align: center;
            font-size: 2rem;
            font-weight: 700;
            color: #2b3a55;
            margin-bottom: 1.5rem;
            letter-spacing: 0.01em;
          }
          .info-row {
            display: flex;
            justify-content: space-between;
            margin-bottom: 1.2rem;
            gap: 2rem;
          }
          .info-label {
            color: #7b8794;
            font-size: 0.98rem;
            margin-right: 0.3rem;
          }
          .info-value {
            color: #2b3a55;
            font-weight: 600;
            font-size: 1.05rem;
          }
          .booking-form {
            display: flex;
            flex-direction: column;
            gap: 1.2rem;
          }
          .form-group {
            position: relative;
            margin-bottom: 0.8rem;
          }
          .form-input {
            width: 100%;
            padding: 1.1rem 0.9rem 0.5rem 0.9rem;
            border: 1.5px solid #b5c6e0;
            border-radius: 0.6rem;
            background: #f9fbfd;
            font-size: 1.05rem;
            color: #2b3a55;
            outline: none;
            transition: border 0.2s;
          }
          .form-input:focus {
            border-color: #5a8dee;
            background: #f1f7fe;
          }
          .form-label {
            position: absolute;
            left: 1rem;
            top: 1.1rem;
            background: transparent;
            color: #8a98b8;
            font-size: 1.05rem;
            pointer-events: none;
            transition: all 0.18s;
          }
          .form-input:focus + .form-label,
          .form-input:not(:placeholder-shown):not([value=""]) + .form-label,
          .form-input:valid + .form-label,
          select.form-input:valid + .form-label {
            top: -0.7rem;
            left: 0.8rem;
            background: #fff;
            padding: 0 0.2rem;
            font-size: 0.92rem;
            color: #5a8dee;
            z-index: 2;
          }
          select.form-input {
            padding-right: 2rem;
          }
          .booking-btn {
            width: 100%;
            padding: 0.9rem;
            background: linear-gradient(90deg, #5a8dee 0%, #36d1c4 100%);
            color: #fff;
            font-weight: 700;
            font-size: 1.12rem;
            border: none;
            border-radius: 0.7rem;
            margin-top: 0.7rem;
            cursor: pointer;
            box-shadow: 0 2px 8px rgba(90, 141, 238, 0.1);
            transition: background 0.18s, box-shadow 0.18s;
          }
          .booking-btn:disabled {
            background: #b5c6e0;
            cursor: not-allowed;
            color: #fff;
          }
          @media (max-width: 600px) {
            .booking-form-card {
              padding: 1.2rem 0.5rem;
            }
            .booking-title {
              font-size: 1.3rem;
            }
            .form-input, .form-label {
              font-size: 0.98rem;
            }
          }
        `}</style>
      </Layout>
    </RequireAuth>
  );
}
