import { useState } from 'react';

export default function Register() {
  const [form, setForm] = useState({
    name: '',
    phone: '',
    role: 'user',
    email: '',
    password: ''
  });
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('http://localhost:5000/api/userActions/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      if (!res.ok) throw new Error('Registration failed');

      setSuccess(true);
      setForm({
        name: '',
        phone: '',
        role: 'user',
        email: '',
        password: ''
      });

    } catch (err) {
      alert(err.message);
      console.error(err);
    }
  };

  return (
    <div className="auth-container">
      <style>{`
        .auth-container {
          background: white;
          max-width: 400px;
          margin: 40px auto;
          padding: 30px;
          border-radius: 8px;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
        }
        .auth-container h2 {
          margin-bottom: 20px;
          text-align: center;
          color: #333;
        }
        .auth-form input, .auth-form select {
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
        .success-message {
          color: green;
          text-align: center;
          margin-top: 15px;
          font-weight: bold;
        }
      `}</style>

      <h2>Register</h2>
      <form onSubmit={handleSubmit} className="auth-form">
        <input name="name" placeholder="Name" value={form.name} onChange={handleChange} required />
        <input name="phone" placeholder="Phone" value={form.phone} onChange={handleChange} required />
        <select name="role" value={form.role} onChange={handleChange}>
          <option value="user">User</option>
          <option value="admin">Admin</option>
        </select>
        <input name="email" type="email" placeholder="Email" value={form.email} onChange={handleChange} required />
        <input name="password" type="password" placeholder="Password" value={form.password} onChange={handleChange} required />
        <button type="submit">Register</button>
      </form>

      {success && <p className="success-message">✅ Registration successful! Please login to continue.</p>}
    </div>
  );
}
