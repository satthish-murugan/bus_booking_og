import React, { useEffect, useState } from 'react';
import RequireAuth from '@/components/RequireAuth';
import Layout from '@/components/layout';

export default function Profile() {
  const [user, setUser] = useState(null);
  const [edit, setEdit] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', phone: '' });

  useEffect(() => {
    // Fetch user profile from backend
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
    // Call your backend to update the profile
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

  if (!user) return <div>Loading...</div>;

  return (
    <RequireAuth>
      <Layout>
      <div style={{ maxWidth: 400, margin: '40px auto', background: '#fff', padding: 30, borderRadius: 10 }}>
        <h2>Profile</h2>
        {edit ? (
          <form onSubmit={handleSave}>
            <input name="name" value={form.name} onChange={handleChange} placeholder="Name" required />
            <input name="email" value={form.email} onChange={handleChange} placeholder="Email" required />
            <input name="phone" value={form.phone} onChange={handleChange} placeholder="Phone" required />
            <button type="submit">Save</button>
            <button type="button" onClick={() => setEdit(false)}>Cancel</button>
          </form>
        ) : (
          <div>
            <p><b>Name:</b> {user.name}</p>
            <p><b>Email:</b> {user.email}</p>
            <p><b>Phone:</b> {user.phone}</p>
            <p><b>Role:</b>{user.role}</p>
            <button onClick={() => setEdit(true)}>Edit</button>
          </div>
        )}
      </div>
      </Layout>
    </RequireAuth>
  );
}