import React, { useEffect, useState } from 'react';
import AdminLayout from '@/pages/layout_admin';

export default function AdminProfile() {
  const [admin, setAdmin] = useState(null);
  const [edit, setEdit] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', phone: '' });

  useEffect(() => {
    fetch('http://localhost:5000/api/userActions/profile', {
      credentials: 'include',
    })
      .then(res => res.json())
      .then(data => {
        setAdmin(data.user);
        setForm({
          name: data.user.name,
          email: data.user.email,
          phone: data.user.phone,
        });
      });
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSave = async (e) => {
    e.preventDefault();
    const res = await fetch('http://localhost:5000/api/userActions/profile', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(form),
    });
    if (res.ok) {
      const data = await res.json();
      setAdmin(data.user);
      setEdit(false);
      alert('Profile updated!');
    } else {
      alert('Failed to update profile');
    }
  };

  if (!admin) return <div className="loading">Loading...</div>;

  return (
    <AdminLayout>
      <style>{`
        body {
          background: linear-gradient(120deg, #e0e7ff 0%, #f0fdfa 100%);
          min-height: 100vh;
        }
        .admin-profile-container {
          max-width: 480px;
          margin: 70px auto;
          padding: 38px 36px 32px;
          background: linear-gradient(120deg, #ffffff 0%, #f1f5f9 100%);
          border-radius: 18px;
          box-shadow: 0 8px 32px 0 rgba(37,99,235,0.10);
          font-family: 'Inter', 'Segoe UI', sans-serif;
          border: 1px solid #e0e7ef;
          position: relative;
          overflow: hidden;
        }
        .admin-profile-container:before {
          content: '';
          position: absolute;
          top: -40px;
          right: -40px;
          width: 120px;
          height: 120px;
          background: radial-gradient(circle, #93c5fd 0%, #f0fdfa 100%);
          opacity: 0.22;
          border-radius: 50%;
          z-index: 0;
        }
        .admin-profile-container h2 {
          text-align: center;
          color: #1e293b;
          font-size: 28px;
          font-weight: 700;
          margin-bottom: 32px;
          letter-spacing: 0.5px;
          z-index: 1;
          position: relative;
        }
        .admin-profile-form label {
          display: block;
          margin: 18px 0 7px 2px;
          font-size: 15px;
          color: #334155;
          font-weight: 600;
          letter-spacing: 0.2px;
        }
        .admin-profile-form input {
          width: 100%;
          padding: 13px 14px;
          margin-bottom: 2px;
          border: 1.5px solid #dbeafe;
          border-radius: 9px;
          font-size: 16px;
          background: #f8fafc;
          transition: border 0.2s;
          outline: none;
        }
        .admin-profile-form input:focus {
          border: 1.5px solid #2563eb;
          background: #fff;
        }
        .admin-buttons {
          display: flex;
          justify-content: space-between;
          margin-top: 28px;
          gap: 16px;
        }
        .admin-buttons button {
          flex: 1;
          padding: 13px 0;
          border: none;
          border-radius: 9px;
          font-weight: 700;
          font-size: 16px;
          cursor: pointer;
          transition: background 0.18s, color 0.18s, box-shadow 0.18s;
          box-shadow: 0 2px 8px rgba(37, 99, 235, 0.06);
        }
        .save-btn {
          background: linear-gradient(90deg, #38bdf8 0%, #2563eb 100%);
          color: #fff;
          box-shadow: 0 2px 8px rgba(37, 99, 235, 0.13);
        }
        .save-btn:hover {
          background: linear-gradient(90deg, #2563eb 0%, #38bdf8 100%);
          color: #fff;
        }
        .cancel-btn {
          background: #f3f4f6;
          color: #334155;
        }
        .cancel-btn:hover {
          background: #e0e7ef;
          color: #1e293b;
        }
        .edit-btn {
          width: 100%;
          background: linear-gradient(90deg, #6366f1 0%, #2563eb 100%);
          color: white;
          padding: 13px 0;
          margin-top: 26px;
          border: none;
          border-radius: 9px;
          font-weight: 700;
          font-size: 16px;
          cursor: pointer;
          transition: background 0.18s, color 0.18s, box-shadow 0.18s;
          box-shadow: 0 2px 8px rgba(99, 102, 241, 0.13);
        }
        .edit-btn:hover {
          background: linear-gradient(90deg, #2563eb 0%, #6366f1 100%);
          color: #fff;
        }
        .admin-info {
          z-index: 1;
          position: relative;
        }
        .admin-info p {
          margin: 15px 0;
          font-size: 17px;
          color: #334155;
          background: #f8fafc;
          padding: 12px 18px;
          border-radius: 7px;
          box-shadow: 0 1px 3px rgba(37, 99, 235, 0.04);
        }
        .admin-info p strong {
          color: #2563eb;
          font-weight: 700;
          margin-right: 7px;
        }
        .loading {
          text-align: center;
          margin-top: 120px;
          font-size: 20px;
          color: #2563eb;
          letter-spacing: 1px;
        }
      `}</style>

      <div className="admin-profile-container">
        <h2>Admin Profile</h2>
        {edit ? (
          <form onSubmit={handleSave} className="admin-profile-form">
            <label htmlFor="name">Full Name</label>
            <input
              id="name"
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="Full Name"
              required
            />
            <label htmlFor="email">Email Address</label>
            <input
              id="email"
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              placeholder="Email Address"
              required
            />
            <label htmlFor="phone">Phone Number</label>
            <input
              id="phone"
              name="phone"
              value={form.phone}
              onChange={handleChange}
              placeholder="Phone Number"
              required
            />
            <div className="admin-buttons">
              <button type="submit" className="save-btn">Save</button>
              <button type="button" className="cancel-btn" onClick={() => setEdit(false)}>Cancel</button>
            </div>
          </form>
        ) : (
          <div className="admin-info">
            <p><strong>Name:</strong> {admin.name}</p>
            <p><strong>Email:</strong> {admin.email}</p>
            <p><strong>Phone:</strong> {admin.phone}</p>
            
            <button className="edit-btn" onClick={() => setEdit(true)}>Edit Profile</button>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
