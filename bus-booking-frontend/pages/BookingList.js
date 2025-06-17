'use client';

import React, { useEffect, useState } from 'react';
import api from '../utils/api';
import Layout from '@/components/layout';
import RequireAuth from '@/components/RequireAuth';

function removeBookedSeats(busId, seats) {
  if (typeof window === 'undefined') return;
  const key = `bookedSeats_${busId}`;
  const prev = JSON.parse(localStorage.getItem(key) || '[]');
  const updated = prev.filter(seat => !seats.includes(seat));
  localStorage.setItem(key, JSON.stringify(updated));
}

export default function BookingList() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchBookings = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.get('/bookings');
      setBookings(res.data);
    } catch (err) {
      setError('Failed to fetch bookings. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (booking) => {
    if (!window.confirm('Are you sure you want to delete this booking?')) return;
    try {
      await api.delete(`/deletePassenger/${booking._id}`);
      const busId = booking.busid || booking.busId || booking._id || booking.bus_id;
      const seatNumbers = (typeof booking.seatnumber === 'string' ? booking.seatnumber.split(',') : [booking.seatnumber])
        .map(s => parseInt(s.trim(), 10))
        .filter(n => !isNaN(n));
      removeBookedSeats(busId, seatNumbers);
      fetchBookings();
    } catch (err) {
      alert('Failed to delete booking.');
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  return (
    <RequireAuth>
      <Layout>
        <div className="booking-list-outer">
          <div className="booking-list-card">
            <h2 className="booking-list-title">My Bookings</h2>
            {loading ? (
              <p className="booking-list-loading">Loading bookings...</p>
            ) : error ? (
              <p className="booking-list-error">{error}</p>
            ) : bookings.length === 0 ? (
              <p className="booking-list-empty">No bookings found</p>
            ) : (
              <div className="booking-table-wrapper">
                <table className="booking-table">
                  <thead>
                    <tr>
                      <th>Passenger Name</th>
                      <th>Bus Number</th>
                      <th>Seat Number</th>
                      <th>Travel Date</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {bookings.map((b) => (
                      <tr key={b._id}>
                        <td>{b.passengername}</td>
                        <td>{b.busnumber}</td>
                        <td>{b.seatnumber}</td>
                        <td>{new Date(b.traveldate).toLocaleDateString()}</td>
                        <td>
                          <button
                            onClick={() => handleDelete(b)}
                            className="booking-delete-btn"
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
        <style jsx>{`
          .booking-list-outer {
            min-height: 100vh;
            background: linear-gradient(120deg, #e0eafc 0%, #cfdef3 100%);
            padding: 48px 0 32px 0;
            display: flex;
            align-items: flex-start;
            justify-content: center;
          }
          .booking-list-card {
            background: #fff;
            border-radius: 1.2rem;
            box-shadow: 0 8px 32px rgba(60, 60, 120, 0.13);
            padding: 2.5rem 2rem 2rem 2rem;
            max-width: 900px;
            width: 100%;
            margin: auto;
          }
          .booking-list-title {
            text-align: center;
            font-size: 2rem;
            font-weight: 700;
            color: #2b3a55;
            margin-bottom: 1.5rem;
            letter-spacing: 0.01em;
          }
          .booking-list-loading,
          .booking-list-error,
          .booking-list-empty {
            text-align: center;
            font-size: 1.1rem;
            margin: 2rem 0;
            color: #5a8dee;
          }
          .booking-list-error {
            color: #e53e3e;
          }
          .booking-table-wrapper {
            overflow-x: auto;
            border-radius: 1rem;
            box-shadow: 0 2px 12px rgba(90,141,238,0.06);
            background: #f9fbfd;
          }
          .booking-table {
            width: 100%;
            border-collapse: separate;
            border-spacing: 0;
            font-size: 1.05rem;
            min-width: 600px;
          }
          .booking-table thead tr {
            background: #f1f7fe;
          }
          .booking-table th, .booking-table td {
            padding: 1rem 1.1rem;
            text-align: left;
            border-bottom: 1px solid #e5eaf2;
          }
          .booking-table th {
            color: #5a8dee;
            font-weight: 700;
            font-size: 1.04rem;
            letter-spacing: 0.01em;
          }
          .booking-table tbody tr {
            transition: background 0.16s;
          }
          .booking-table tbody tr:hover {
            background: #e8f0fe;
          }
          .booking-delete-btn {
            background: linear-gradient(90deg, #ef4444 0%, #f87171 100%);
            color: #fff;
            border: none;
            border-radius: 0.5rem;
            padding: 7px 22px;
            font-weight: 600;
            font-size: 1rem;
            cursor: pointer;
            transition: background 0.15s, box-shadow 0.15s;
            box-shadow: 0 1px 4px rgba(239,68,68,0.09);
          }
          .booking-delete-btn:hover {
            background: linear-gradient(90deg, #dc2626 0%, #f87171 100%);
            box-shadow: 0 2px 8px rgba(239,68,68,0.13);
          }
          @media (max-width: 700px) {
            .booking-list-card {
              padding: 1.2rem 0.5rem;
            }
            .booking-list-title {
              font-size: 1.3rem;
            }
            .booking-table th, .booking-table td {
              padding: 0.7rem 0.5rem;
              font-size: 0.98rem;
            }
            .booking-table {
              min-width: 420px;
            }
          }
        `}</style>
      </Layout>
    </RequireAuth>
  );
}
