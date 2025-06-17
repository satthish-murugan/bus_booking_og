import React, { useEffect, useState } from 'react';
import RequireAuth from '@/components/RequireAuth';
import Layout from '@/components/layout';

export default function Profile() {
  const [user, setUser] = useState(null);
  const [edit, setEdit] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', phone: '' });

  useEffect(() => {
    fetch('http://localhost:5000/api/userActions/profile', {
      credentials: 'include',
    })
      .then(res => res.json())
      .then(data => {
        setUser(data.user);
        setForm({
          name: data.user.name,
          email: data.user.email,
          phone: data.user.phone,
        });
      });
  }, []);

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSave = async e => {
    e.preventDefault();
    const res = await fetch('http://localhost:5000/api/userActions/profile', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(form),
    });
    if (res.ok) {
      const data = await res.json();
      setUser(data.user);
      setEdit(false);
      alert('Profile updated!');
    } else {
      alert('Failed to update profile');
    }
  };

  if (!user) return <div className="loading">Loading...</div>;

  return (
    <RequireAuth>
      <Layout>
        <style>{`
          body {
            background: linear-gradient(120deg, #f5f7fa 0%, #c3cfe2 100%);
            min-height: 100vh;
          }
          .profile-container {
            max-width: 430px;
            margin: 70px auto;
            padding: 38px 36px 32px;
            background: linear-gradient(120deg, #ffffff 0%, #f7faff 100%);
            border-radius: 18px;
            box-shadow: 0 8px 32px 0 rgba(31,38,135,0.13);
            font-family: 'Inter', 'Roboto', sans-serif;
            border: 1px solid #e3e8f0;
            position: relative;
            overflow: hidden;
          }
          .profile-container:before {
            content: '';
            position: absolute;
            top: -40px;
            right: -40px;
            width: 120px;
            height: 120px;
            background: radial-gradient(circle, #a8edea 0%, #fed6e3 100%);
            opacity: 0.25;
            border-radius: 50%;
            z-index: 0;
          }
          .profile-container h2 {
            text-align: center;
            color: #2d3748;
            font-size: 28px;
            font-weight: 700;
            margin-bottom: 32px;
            letter-spacing: 0.5px;
            z-index: 1;
            position: relative;
          }
          .profile-form label {
            display: block;
            margin: 18px 0 7px 2px;
            font-size: 15px;
            color: #4a5568;
            font-weight: 600;
            letter-spacing: 0.2px;
          }
          .profile-form input {
            width: 100%;
            padding: 13px 14px;
            margin-bottom: 2px;
            border: 1.5px solid #e2e8f0;
            border-radius: 9px;
            font-size: 16px;
            background: #f8fafc;
            transition: border 0.2s;
            outline: none;
          }
          .profile-form input:focus {
            border: 1.5px solid #7f9cf5;
            background: #fff;
          }
          .profile-buttons {
            display: flex;
            justify-content: space-between;
            margin-top: 28px;
            gap: 16px;
          }
          .profile-buttons button {
            flex: 1;
            padding: 13px 0;
            border: none;
            border-radius: 9px;
            font-weight: 700;
            font-size: 16px;
            cursor: pointer;
            transition: background 0.18s, color 0.18s, box-shadow 0.18s;
            box-shadow: 0 2px 8px rgba(127, 156, 245, 0.06);
          }
          .save-btn {
            background: linear-gradient(90deg, #43e97b 0%, #38f9d7 100%);
            color: #fff;
            box-shadow: 0 2px 8px rgba(67, 233, 123, 0.13);
          }
          .save-btn:hover {
            background: linear-gradient(90deg, #38f9d7 0%, #43e97b 100%);
            color: #212529;
          }
          .cancel-btn {
            background: #f3f4f6;
            color: #7b8794;
          }
          .cancel-btn:hover {
            background: #e2e8f0;
            color: #2d3748;
          }
          .edit-btn {
            width: 100%;
            background: linear-gradient(90deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 13px 0;
            margin-top: 26px;
            border: none;
            border-radius: 9px;
            font-weight: 700;
            font-size: 16px;
            cursor: pointer;
            transition: background 0.18s, color 0.18s, box-shadow 0.18s;
            box-shadow: 0 2px 8px rgba(102, 126, 234, 0.13);
          }
          .edit-btn:hover {
            background: linear-gradient(90deg, #764ba2 0%, #667eea 100%);
            color: #fff;
          }
          .profile-info {
            z-index: 1;
            position: relative;
          }
          .profile-info p {
            margin: 15px 0;
            font-size: 17px;
            color: #4a5568;
            background: #f8fafc;
            padding: 12px 18px;
            border-radius: 7px;
            box-shadow: 0 1px 3px rgba(67, 233, 123, 0.04);
          }
          .profile-info p strong {
            color: #667eea;
            font-weight: 700;
            margin-right: 7px;
          }
          .loading {
            text-align: center;
            margin-top: 120px;
            font-size: 20px;
            color: #667eea;
            letter-spacing: 1px;
          }
        `}</style>

        <div className="profile-container">
          <h2>Profile</h2>
          {edit ? (
            <form onSubmit={handleSave} className="profile-form">
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
              <div className="profile-buttons">
                <button type="submit" className="save-btn">Save</button>
                <button type="button" className="cancel-btn" onClick={() => setEdit(false)}>Cancel</button>
              </div>
            </form>
          ) : (
            <div className="profile-info">
              <p><strong>Name:</strong> {user.name}</p>
              <p><strong>Email:</strong> {user.email}</p>
              <p><strong>Phone:</strong> {user.phone}</p>
              
              <button className="edit-btn" onClick={() => setEdit(true)}>Edit Profile</button>
            </div>
          )}
        </div>
      </Layout>
    </RequireAuth>
  );
}
