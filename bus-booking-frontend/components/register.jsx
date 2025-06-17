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
    <div className="auth-bg">
      <div className="auth-container">
        <div className="register-icon" aria-label="register">📝</div>
        <h2 className="register-title">Create Account</h2>
        <form onSubmit={handleSubmit} className="auth-form">
          <label htmlFor="name">Name</label>
          <input
            name="name"
            id="name"
            placeholder="Your name"
            value={form.name}
            onChange={handleChange}
            required
          />
          <label htmlFor="phone">Phone</label>
          <input
            name="phone"
            id="phone"
            placeholder="Your phone"
            value={form.phone}
            onChange={handleChange}
            required
          />
          <label htmlFor="role">Role</label>
          <select
            name="role"
            id="role"
            value={form.role}
            onChange={handleChange}
          >
            <option value="user">User</option>
            <option value="admin">Admin</option>
          </select>
          <label htmlFor="email">Email</label>
          <input
            name="email"
            id="email"
            type="email"
            placeholder="Your email"
            value={form.email}
            onChange={handleChange}
            required
          />
          <label htmlFor="password">Password</label>
          <input
            name="password"
            id="password"
            type="password"
            placeholder="Create a password"
            value={form.password}
            onChange={handleChange}
            required
          />
          <button type="submit">Register</button>
        </form>
        {success && (
          <p className="success-message">
            ✅ Registration successful! Please login to continue.
          </p>
        )}
      </div>
      <style jsx>{`
        .auth-bg {
          min-height: 100vh;
          background: linear-gradient(120deg, #e0e7ff 0%, #f0fdfa 100%);
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 40px 0;
        }
        .auth-container {
          max-width: 400px;
          width: 100%;
          margin: 0 auto;
          padding: 38px 32px 30px;
          border-radius: 18px;
          background: rgba(255,255,255,0.95);
          box-shadow: 0 8px 32px 0 rgba(37,99,235,0.10);
          backdrop-filter: blur(3px);
          font-family: 'Inter', 'Segoe UI', Arial, sans-serif;
        }
        .register-icon {
          font-size: 2.5rem;
          display: flex;
          justify-content: center;
          margin-bottom: 10px;
        }
        .register-title {
          text-align: center;
          font-size: 2rem;
          color: #2563eb;
          margin-bottom: 26px;
          font-weight: 700;
          letter-spacing: 0.5px;
        }
        .auth-form {
          display: flex;
          flex-direction: column;
          gap: 13px;
        }
        .auth-form label {
          font-weight: 600;
          color: #334155;
          margin-bottom: 3px;
          font-size: 1rem;
        }
        .auth-form input, .auth-form select {
          padding: 13px 14px;
          border: 1.5px solid #dbeafe;
          border-radius: 9px;
          font-size: 1rem;
          background: #f8fafc;
          transition: border 0.2s;
          outline: none;
        }
        .auth-form input:focus, .auth-form select:focus {
          border: 1.5px solid #2563eb;
          background: #fff;
        }
        .auth-form button {
          margin-top: 10px;
          padding: 0.9rem 0;
          font-size: 1.1rem;
          border: none;
          border-radius: 9px;
          background: linear-gradient(90deg, #38bdf8 0%, #2563eb 100%);
          color: white;
          font-weight: 700;
          cursor: pointer;
          box-shadow: 0 2px 8px rgba(37, 99, 235, 0.09);
          transition: background 0.17s, box-shadow 0.17s;
          letter-spacing: 0.5px;
        }
        .auth-form button:hover {
          background: linear-gradient(90deg, #2563eb 0%, #38bdf8 100%);
          box-shadow: 0 4px 20px rgba(37,99,235,0.17);
        }
        .success-message {
          color: #10b981;
          text-align: center;
          margin-top: 18px;
          font-weight: bold;
          font-size: 1.08rem;
        }
        @media (max-width: 600px) {
          .auth-container {
            padding: 18px 6vw 16px;
          }
        }
      `}</style>
    </div>
  );
}
