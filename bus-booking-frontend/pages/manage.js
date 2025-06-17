'use client';

import React, { useEffect, useState } from 'react';
import Cookies from 'js-cookie';
import AdminLayout from './layout_admin';

export default function ManageBookings() {
  const [buses, setBuses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editId, setEditId] = useState(null);
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
    fetchBuses();
  }, []);

  const fetchBuses = async () => {
    try {
      const token = Cookies.get('token');
      const res = await fetch('http://localhost:5000/api/userActions/buses', {
        credentials: 'include',
        headers: {
          Authorization: `Bearer ${token}`,
        },
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

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this bus?')) return;
    try {
      const token = Cookies.get('token');
      const res = await fetch(`http://localhost:5000/api/userActions/delete/${id}`, {
        method: 'DELETE',
        credentials: 'include',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!res.ok) throw new Error('Failed to delete bus');
      alert('Bus deleted successfully');
      fetchBuses();
    } catch (err) {
      alert(err.message);
    }
  };

  const handleEdit = (bus) => {
    setFormData({
      ...bus,
      pricePerSeat: bus.pricePerSeat.toString(),
      totalSeats: bus.totalSeats.toString(),
      date: bus.date ? bus.date.split('T')[0] : '',
    });
    setEditId(bus._id);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const token = Cookies.get('token');
      const res = await fetch(`http://localhost:5000/api/userActions/edit/${editId}`, {
        method: 'PUT',
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
      if (!res.ok) throw new Error('Failed to update');
      alert('Bus updated successfully');
      setEditId(null);
      setFormData({
        busNumber: '', busName: '', from: '', to: '',
        departureTime: '', arrivalTime: '', pricePerSeat: '', date: '', totalSeats: '',
      });
      fetchBuses();
    } catch (err) {
      alert(err.message);
    }
  };

  if (loading) return (
    <AdminLayout>
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Loading buses...</p>
      </div>
      <style jsx>{`
        .loading-container {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          height: 200px;
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
      `}</style>
    </AdminLayout>
  );

  return (
    <AdminLayout>
      <div className="manage-bg">
        <div className="manage-container">
          <h2 className="page-title">🚌 Manage Bus Schedule</h2>
          
          {editId && (
            <div className="edit-form-container">
              <h3>Edit Bus Details</h3>
              <form onSubmit={handleUpdate} className="edit-form">
                <div className="form-grid">
                  {Object.entries(formData).map(([field, value]) => (
                    <div className="form-group" key={field}>
                      <label>
                        {field === 'pricePerSeat'
                          ? 'Price Per Seat'
                          : field === 'totalSeats'
                          ? 'Total Seats'
                          : field.split(/(?=[A-Z])/).join(' ').replace(/^\w/, c => c.toUpperCase())}
                      </label>
                      <input
                        name={field}
                        value={value}
                        onChange={(e) => setFormData({ ...formData, [field]: e.target.value })}
                        type={field === 'date' ? 'date' : 'text'}
                        required
                        className="form-input"
                      />
                    </div>
                  ))}
                </div>
                <div className="form-actions">
                  <button type="submit" className="btn-primary">Update Bus</button>
                  <button 
                    type="button" 
                    onClick={() => setEditId(null)} 
                    className="btn-secondary"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          )}

          <div className="table-container">
            <table className="bus-table">
              <thead>
                <tr>
                  <th>Bus No</th>
                  <th>Name</th>
                  <th>Route</th>
                  <th>Timings</th>
                  <th>Price</th>
                  <th>Date</th>
                  <th>Seats</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {buses.map((bus) => (
                  <tr key={bus._id}>
                    <td data-label="Bus No">{bus.busNumber}</td>
                    <td data-label="Name">{bus.busName}</td>
                    <td data-label="Route">
                      <span className="route">
                        {bus.from} → {bus.to}
                      </span>
                    </td>
                    <td data-label="Timings">
                      <div className="timings">
                        <span className="departure">{bus.departureTime}</span>
                        <span className="separator">→</span>
                        <span className="arrival">{bus.arrivalTime}</span>
                      </div>
                    </td>
                    <td data-label="Price">₹{bus.pricePerSeat}</td>
                    <td data-label="Date">{bus.date?.split('T')[0]}</td>
                    <td data-label="Seats">{bus.totalSeats}</td>
                    <td data-label="Actions" className="actions">
                      <button 
                        onClick={() => handleEdit(bus)} 
                        className="btn-edit"
                      >
                        ✏️ Edit
                      </button>
                      <button 
                        onClick={() => handleDelete(bus._id)} 
                        className="btn-delete"
                      >
                        🗑️ Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      <style jsx>{`
        .manage-bg {
          min-height: 100vh;
          background: linear-gradient(120deg, #e0e7ff 0%, #f0fdfa 100%);
          padding: 0;
        }
        .manage-container {
          padding: 2rem 2vw;
          max-width: 1200px;
          margin: 0 auto;
        }
        .page-title {
          color: #2563eb;
          margin-bottom: 2rem;
          font-size: 2rem;
          font-weight: 700;
          display: flex;
          align-items: center;
          gap: 0.5rem;
          letter-spacing: 0.5px;
        }
        .edit-form-container {
          background: rgba(255,255,255,0.97);
          border-radius: 1rem;
          padding: 2rem 1.5rem;
          margin-bottom: 2rem;
          box-shadow: 0 4px 24px rgba(37,99,235,0.09);
        }
        .edit-form-container h3 {
          margin-top: 0;
          color: #4a5568;
          margin-bottom: 1.5rem;
          text-align: center;
        }
        .form-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
          gap: 1rem;
          margin-bottom: 1.5rem;
        }
        .form-group {
          display: flex;
          flex-direction: column;
        }
        .form-group label {
          margin-bottom: 0.5rem;
          font-size: 0.97rem;
          color: #4a5568;
          font-weight: 600;
        }
        .form-input {
          padding: 0.7rem;
          border: 1.5px solid #dbeafe;
          border-radius: 0.5rem;
          font-size: 1rem;
          background: #f8fafc;
          transition: border 0.2s;
        }
        .form-input:focus {
          border: 1.5px solid #2563eb;
          background: #fff;
        }
        .form-actions {
          display: flex;
          gap: 1rem;
          justify-content: center;
        }
        .btn-primary {
          background: linear-gradient(90deg, #38bdf8 0%, #10b981 100%);
          color: white;
          padding: 0.6rem 1.4rem;
          border: none;
          border-radius: 0.5rem;
          cursor: pointer;
          font-weight: 600;
          transition: background 0.2s;
        }
        .btn-primary:hover {
          background: linear-gradient(90deg, #10b981 0%, #38bdf8 100%);
        }
        .btn-secondary {
          background: #e2e8f0;
          color: #4a5568;
          padding: 0.6rem 1.4rem;
          border: none;
          border-radius: 0.5rem;
          cursor: pointer;
          font-weight: 600;
          transition: background 0.2s;
        }
        .btn-secondary:hover {
          background: #cbd5e1;
        }
        .table-container {
          overflow-x: auto;
          background: rgba(255,255,255,0.97);
          border-radius: 1rem;
          box-shadow: 0 4px 24px rgba(37,99,235,0.09);
        }
        .bus-table {
          width: 100%;
          border-collapse: collapse;
        }
        .bus-table th {
          background: linear-gradient(90deg, #38bdf8 0%, #2563eb 100%);
          padding: 1rem;
          text-align: left;
          font-weight: 700;
          color: #fff;
          border-bottom: 1px solid #e2e8f0;
          letter-spacing: 0.2px;
        }
        .bus-table td {
          padding: 1rem;
          border-bottom: 1px solid #e2e8f0;
          color: #334155;
          font-size: 1rem;
        }
        .bus-table tr:hover {
          background-color: #f0fdfa;
        }
        .route {
          font-weight: 600;
          color: #2563eb;
        }
        .timings {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }
        .separator {
          color: #a0aec0;
        }
        .departure, .arrival {
          font-weight: 500;
        }
        .actions {
          display: flex;
          gap: 0.5rem;
        }
        .btn-edit {
          background: linear-gradient(90deg, #fbbf24 0%, #f59e42 100%);
          color: #7c4700;
          padding: 0.45rem 1.1rem;
          border: none;
          border-radius: 0.4rem;
          cursor: pointer;
          font-size: 0.95rem;
          font-weight: 600;
          transition: background 0.2s;
          display: flex;
          align-items: center;
          gap: 0.25rem;
        }
        .btn-edit:hover {
          background: linear-gradient(90deg, #f59e42 0%, #fbbf24 100%);
        }
        .btn-delete {
          background: linear-gradient(90deg, #f87171 0%, #dc2626 100%);
          color: #fff;
          padding: 0.45rem 1.1rem;
          border: none;
          border-radius: 0.4rem;
          cursor: pointer;
          font-size: 0.95rem;
          font-weight: 600;
          transition: background 0.2s;
          display: flex;
          align-items: center;
          gap: 0.25rem;
        }
        .btn-delete:hover {
          background: linear-gradient(90deg, #dc2626 0%, #f87171 100%);
        }
        @media (max-width: 900px) {
          .form-grid {
            grid-template-columns: 1fr;
          }
        }
        @media (max-width: 768px) {
          .bus-table thead {
            display: none;
          }
          .bus-table tr {
            display: block;
            margin-bottom: 1rem;
            border: 1px solid #e2e8f0;
            border-radius: 0.375rem;
          }
          .bus-table td {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 0.75rem;
          }
          .bus-table td::before {
            content: attr(data-label);
            font-weight: 600;
            color: #2563eb;
            margin-right: 1rem;
          }
          .actions {
            justify-content: flex-end;
          }
        }
      `}</style>
    </AdminLayout>
  );
}
