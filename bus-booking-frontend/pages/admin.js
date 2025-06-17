'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';
import AdminLayout from './layout_admin';

export default function AdminPage() {
  const router = useRouter();
  const [buses, setBuses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    busNumber: '',
    busName: '',
    from: '',
    to: '',
    departureTime: '',
    arrivalTime: '',
    pricePerSeat: '',
    date: '',
    totalSeats: '',
  });

  useEffect(() => {
    const userStr = localStorage.getItem('user');
    if (!userStr) {
      router.push('/');
      return;
    }
    const user = JSON.parse(userStr);
    if (user.role !== 'admin') {
      alert('Access denied: Admins only');
      router.push('/');
      return;
    }
    fetchBuses();
    // eslint-disable-next-line
  }, []);

  const fetchBuses = async () => {
    try {
      setLoading(true);
      const token = Cookies.get('token');
      const res = await fetch('http://localhost:5000/api/userActions/buses', {
        credentials: 'include',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error('Failed to fetch buses');
      const data = await res.json();
      setBuses(data);
    } catch (err) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddBus = async (e) => {
    e.preventDefault();
    try {
      const token = Cookies.get('token');
      const res = await fetch('http://localhost:5000/api/userActions/add', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          ...formData,
          pricePerSeat: Number(formData.pricePerSeat),
          totalSeats: Number(formData.totalSeats),
        }),
      });
      if (!res.ok) throw new Error('Failed to add bus');
      setFormData({
        busNumber: '',
        busName: '',
        from: '',
        to: '',
        departureTime: '',
        arrivalTime: '',
        pricePerSeat: '',
        date: '',
        totalSeats: '',
      });
      setShowForm(false);
      fetchBuses();
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <AdminLayout>
      <div className="admin-bus-bg">
        <h2 className="admin-bus-title">🚌 All Buses</h2>
        <div className="add-bus-bar">
          <button className="add-bus-btn" onClick={() => setShowForm((v) => !v)}>
            {showForm ? 'Close' : '+ Add Bus'}
          </button>
        </div>
        {showForm && (
          <div className="bus-form-box">
            <h3>Add New Bus</h3>
            <form onSubmit={handleAddBus}>
              <div className="form-grid">
                <div>
                  <label>Bus Number</label>
                  <input name="busNumber" value={formData.busNumber} onChange={handleFormChange} required />
                </div>
                <div>
                  <label>Bus Name</label>
                  <input name="busName" value={formData.busName} onChange={handleFormChange} required />
                </div>
                <div>
                  <label>From</label>
                  <input name="from" value={formData.from} onChange={handleFormChange} required />
                </div>
                <div>
                  <label>To</label>
                  <input name="to" value={formData.to} onChange={handleFormChange} required />
                </div>
                <div>
                  <label>Departure Time</label>
                  <input name="departureTime" value={formData.departureTime} onChange={handleFormChange} required />
                </div>
                <div>
                  <label>Arrival Time</label>
                  <input name="arrivalTime" value={formData.arrivalTime} onChange={handleFormChange} required />
                </div>
                <div>
                  <label>Price Per Seat</label>
                  <input name="pricePerSeat" type="number" min="0" value={formData.pricePerSeat} onChange={handleFormChange} required />
                </div>
                <div>
                  <label>Date</label>
                  <input name="date" type="date" value={formData.date} onChange={handleFormChange} required />
                </div>
                <div>
                  <label>Total Seats</label>
                  <input name="totalSeats" type="number" min="1" value={formData.totalSeats} onChange={handleFormChange} required />
                </div>
              </div>
              <button type="submit" className="submit-btn">Add Bus</button>
            </form>
          </div>
        )}

        {/* Always keep space below the form */}
        <div style={{ marginBottom: showForm ? '48px' : '24px' }} />

        {loading ? (
          <div className="loading-container">
            <div className="spinner"></div>
            <p>Loading buses...</p>
          </div>
        ) : (
          <div className="bus-list">
            {buses.length === 0 ? (
              <div className="no-buses">No buses found.</div>
            ) : (
              buses.map((bus) => (
                <div className="bus-card" key={bus._id}>
                  <div className="bus-header">
                    <span className="bus-icon"></span>
                    <span className="bus-title">{bus.busName}</span>
                    <span className="bus-number">#{bus.busNumber}</span>
                  </div>
                  <div className="bus-info-row">
                    <span className="info-label">Route:</span>
                    <span className="info-value">{bus.from} → {bus.to}</span>
                  </div>
                  <div className="bus-info-row">
                    <span className="info-label">Timings:</span>
                    <span className="info-value">{bus.departureTime} <span className="arrow">→</span> {bus.arrivalTime}</span>
                  </div>
                  <div className="bus-info-row">
                    <span className="info-label">Date:</span>
                    <span className="info-value">{bus.date?.split('T')[0]}</span>
                  </div>
                  <div className="bus-info-row">
                    <span className="info-label">Price:</span>
                    <span className="info-value">₹{bus.pricePerSeat} <span className="info-label">/seat</span></span>
                  </div>
                  <div className="bus-info-row">
                    <span className="info-label">Total Seats:</span>
                    <span className="info-value">{bus.totalSeats}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>
      <style jsx>{`
        .admin-bus-bg {
          min-height: 100vh;
          background: linear-gradient(120deg, #e0e7ff 0%, #f0fdfa 100%);
          padding: 0;
        }
        .admin-bus-title {
          text-align: center;
          font-size: 2rem;
          font-weight: 700;
          color: #2563eb;
          margin-bottom: 18px;
          letter-spacing: 0.5px;
        }
        .add-bus-bar {
          display: flex;
          justify-content: center;
          margin-bottom: 28px;
        }
        .add-bus-btn {
          background: linear-gradient(90deg, #2563eb 0%, #38bdf8 100%);
          color: #fff;
          border: none;
          padding: 13px 38px;
          border-radius: 9px;
          font-weight: 700;
          font-size: 1.1rem;
          box-shadow: 0 2px 8px rgba(37,99,235,0.09);
          cursor: pointer;
          transition: background 0.17s, box-shadow 0.17s;
        }
        .add-bus-btn:hover {
          background: linear-gradient(90deg, #38bdf8 0%, #2563eb 100%);
        }
        .bus-form-box {
          margin: 0 auto 0 auto;
          max-width: 650px;
          padding: 36px 32px 26px;
          background: rgba(255,255,255,0.97);
          border-radius: 20px;
          box-shadow: 0 4px 24px rgba(37,99,235,0.12);
        }
        .bus-form-box h3 {
          text-align: center;
          color: #2563eb;
          margin-bottom: 24px;
          font-size: 1.3rem;
          font-weight: 700;
        }
        .form-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 1.3rem;
          margin-bottom: 2rem;
        }
        .bus-form-box label {
          font-weight: 600;
          color: #334155;
          margin-bottom: 3px;
          font-size: 1rem;
        }
        .bus-form-box input {
          padding: 12px 13px;
          border: 1.5px solid #dbeafe;
          border-radius: 8px;
          font-size: 1rem;
          background: #f8fafc;
          transition: border 0.2s;
          outline: none;
        }
        .bus-form-box input:focus {
          border: 1.5px solid #2563eb;
          background: #fff;
        }
        .submit-btn {
          background: linear-gradient(90deg, #38bdf8 0%, #10b981 100%);
          color: #fff;
          border: none;
          padding: 14px 0;
          border-radius: 8px;
          font-weight: 700;
          cursor: pointer;
          font-size: 1.1rem;
          width: 100%;
          transition: background 0.17s, box-shadow 0.17s;
          box-shadow: 0 2px 8px rgba(16,185,129,0.09);
        }
        .submit-btn:hover {
          background: linear-gradient(90deg, #10b981 0%, #38bdf8 100%);
        }
        .bus-list {
          margin-top: 0;
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(340px, 1fr));
          gap: 2.5rem;
          max-width: 1100px;
          margin-left: auto;
          margin-right: auto;
          margin-bottom: 40px;
          padding: 0 12px;
        }
        .bus-card {
          background: rgba(255,255,255,0.97);
          border-radius: 20px;
          box-shadow: 0 4px 24px rgba(37,99,235,0.09);
          padding: 32px 26px 22px;
          display: flex;
          flex-direction: column;
          gap: 14px;
          position: relative;
          border: 1.5px solid #e0e7ef;
          transition: box-shadow 0.15s, border 0.15s;
        }
        .bus-card:hover {
          box-shadow: 0 8px 32px rgba(37,99,235,0.16);
          border-color: #2563eb33;
        }
        .bus-header {
          display: flex;
          align-items: center;
          gap: 14px;
          margin-bottom: 7px;
        }
        .bus-icon {
          font-size: 2rem;
        }
        .bus-title {
          font-size: 1.25rem;
          font-weight: 700;
          color: #2563eb;
          letter-spacing: 0.2px;
        }
        .bus-number {
          background: #2563eb;
          color: #fff;
          font-size: 0.97rem;
          padding: 3px 12px;
          border-radius: 7px;
          font-weight: 500;
          margin-left: auto;
        }
        .bus-info-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 2px 0;
          font-size: 1.05rem;
        }
        .info-label {
          color: #64748b;
          font-size: 1rem;
          font-weight: 500;
        }
        .info-value {
          color: #1e293b;
          font-size: 1rem;
          font-weight: 600;
        }
        .arrow {
          color: #2563eb;
          font-size: 1.1rem;
          font-weight: 700;
        }
        .no-buses {
          text-align: center;
          color: #64748b;
          font-size: 1.2rem;
          padding: 40px 0;
        }
        .loading-container {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          min-height: 300px;
          gap: 1rem;
        }
        .spinner {
          border: 4px solid rgba(0, 0, 0, 0.1);
          border-radius: 50%;
          border-top: 4px solid #3b82f6;
          width: 40px;
          height: 40px;
          animation: spin 1s linear infinite;
        }
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        @media (max-width: 900px) {
          .form-grid {
            grid-template-columns: 1fr;
          }
        }
        @media (max-width: 600px) {
          .bus-list {
            grid-template-columns: 1fr;
            gap: 1.5rem;
          }
          .bus-card {
            padding: 18px 7vw 14px;
          }
          .bus-form-box {
            padding: 18px 4vw 12px;
          }
        }
      `}</style>
    </AdminLayout>
  );
}
