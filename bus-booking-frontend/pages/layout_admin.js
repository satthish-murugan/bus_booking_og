'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';
import Link from 'next/link';

export default function AdminLayout({ children }) {
  const router = useRouter();
  const [profile, setProfile] = useState(null);

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
    } else {
      setProfile(user);
    }
  }, [router]);

  const handleLogout = async () => {
    await fetch('http://localhost:5000/api/userActions/logout', {
      method: 'POST',
      credentials: 'include',
    });
    Cookies.remove('token');
    localStorage.removeItem('user');
    setProfile(null);
    router.push('/');
  };

  return (
    <>
      <style jsx>{`
        .header {
          background: linear-gradient(90deg, #2563eb 0%, #38bdf8 100%);
          box-shadow: 0 4px 18px rgba(37, 99, 235, 0.13);
          color: white;
          font-family: 'Inter', 'Segoe UI', Arial, sans-serif;
          position: sticky;
          top: 0;
          z-index: 100;
        }
        .nav-container {
          max-width: 1200px;
          margin: 0 auto;
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 0 24px;
          min-height: 70px;
        }
        .nav-container h1 {
          font-size: 1.8rem;
          font-weight: 900;
          color: #4ade80;
          display: flex;
          align-items: center;
          gap: 10px;
        }
        .nav-group { /* NEW: wrap nav-links-group and logout-group */
          display: flex;
          align-items: center;
          gap: 20px; /* This adds spacing between nav-links, profile, and logout */
        }
        .nav-links-group {
          display: flex;
          align-items: center;
          gap: 20px;
        }
        .nav-btn {
          background: rgba(255, 255, 255, 0.13);
          color: #fff;
          font-size: 1rem;
          font-weight: 600;
          padding: 9px 20px;
          border-radius: 22px;
          cursor: pointer;
          text-decoration: none;
          transition: all 0.2s ease;
        }
        .nav-btn:hover {
          background: rgba(255, 255, 255, 0.22);
          color: #ffe066;
        }
        .logout-group {
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .profile-btn {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 0.93rem;
          color: #2563eb;
          background: rgba(255, 255, 255, 0.85);
          border-radius: 16px;
          font-weight: 600;
          padding: 6px 13px 6px 7px;
          box-shadow: 0 1px 8px #2563eb1a;
          border: 1.2px solid #e0e7ff;
          text-decoration: none;
          transition: all 0.18s;
        }
        .profile-btn:hover {
          background: #e0e7ff;
          color: #1d4ed8;
          border: 1.2px solid #2563eb;
          box-shadow: 0 4px 14px #2563eb22;
        }
        .profile-avatar {
          width: 24px;
          height: 24px;
          border-radius: 50%;
          background: linear-gradient(135deg, #38bdf8 0%, #2563eb 100%);
          color: #fff;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 700;
          font-size: 0.93rem;
        }
        .logout-button {
          background: linear-gradient(90deg, #f87171 0%, #dc2626 100%);
          border: none;
          color: white;
          font-weight: 600;
          border-radius: 22px;
          padding: 9px 20px;
          cursor: pointer;
        }
        .logout-button:hover {
          background: linear-gradient(90deg, #dc2626 0%, #f87171 100%);
          color: #ffe066;
        }
        main {
          min-height: 80vh;
          background: linear-gradient(120deg, #f4f7fb 0%, #e0e7ff 100%);
          padding: 40px 20px 30px;
        }
        .admin-main-card {
          max-width: 1200px;
          margin: 0 auto;
          background: rgba(255, 255, 255, 0.97);
          padding: 38px 30px;
          border-radius: 22px;
          box-shadow: 0 0 18px rgba(37, 99, 235, 0.08);
        }
        footer {
          text-align: center;
          padding: 18px 0;
          background: linear-gradient(90deg, #2563eb 0%, #38bdf8 100%);
          color: white;
          font-size: 1rem;
        }
      `}</style>

      <header className="header">
        <div className="nav-container">
          <h1>Quick Bus Admin Panel</h1>
          <div className="nav-group">
            <div className="nav-links-group">
              <Link href="/admin" legacyBehavior>
                <a className="nav-btn">Home</a>
              </Link>
              <Link href="/manage" legacyBehavior>
                <a className="nav-btn">Manage Buses</a>
              </Link>
            </div>
            <div className="logout-group">
              {profile && (
                <Link href="/profile_admin" legacyBehavior>
                  <a className="profile-btn">
                    <span className="profile-avatar">
                      {profile.name
                        ? profile.name.charAt(0).toUpperCase()
                        : (profile.email ? profile.email.charAt(0).toUpperCase() : '👤')}
                    </span>
                    <span>
                      {profile.name ? profile.name.split(' ')[0] : profile.email}
                    </span>
                  </a>
                </Link>
              )}
              <button className="logout-button" onClick={handleLogout}>
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      <main>
        <div className="admin-main-card">{children}</div>
      </main>

      <footer>
        &copy; {new Date().getFullYear()} Bus Booking System. All rights reserved.
      </footer>
    </>
  );
}
