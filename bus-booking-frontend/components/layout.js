'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';

export default function Layout({ children }) {
  const router = useRouter();
  const [profile, setProfile] = useState(null);

  const handleLogout = async () => {
    try {
      await fetch('http://localhost:5000/api/userActions/logout', {
        method: 'POST',
        credentials: 'include',
      });
      Cookies.remove('token');
      setProfile(null);
      router.push('/');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  useEffect(() => {
    async function fetchProfile() {
      try {
        const res = await fetch('http://localhost:5000/api/userActions/profile', {
          method: 'GET',
          credentials: 'include',
        });
        if (res.ok) {
          const data = await res.json();
          setProfile(data.user);
        } else {
          setProfile(null);
        }
      } catch (error) {
        console.error('Failed to fetch profile:', error);
        setProfile(null);
      }
    }
    fetchProfile();
  }, []);

  return (
    <>
      <style jsx>{`
        .header {
          background: linear-gradient(90deg, #2563eb 0%, #38bdf8 100%);
          box-shadow: 0 4px 18px rgba(37,99,235,0.13);
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
          padding: 0 16px;
          min-height: 56px;
        }
        .nav-container h1 {
          margin: 0;
          font-size: 1.15rem;
          font-weight: 800;
          letter-spacing: 0.5px;
          color: #4ade80;
          text-shadow: 1px 2px 8px #38bdf855;
          display: flex;
          align-items: center;
          gap: 7px;
          word-spacing: 1px;
        }
        .nav-links-group {
          display: flex;
          align-items: center;
          gap: 6px;
        }
        .nav-btn {
          display: inline-block;
          background: rgba(255,255,255,0.13);
          color: #fff;
          font-size: 0.93rem;
          font-weight: 500;
          padding: 7px 14px;
          border-radius: 16px;
          border: none;
          box-shadow: 0 2px 8px rgba(56,189,248,0.08);
          cursor: pointer;
          outline: none;
          text-decoration: none;
          transition: background 0.18s, color 0.18s, box-shadow 0.18s, transform 0.18s;
          margin: 0;
          letter-spacing: 0.01em;
          word-spacing: 0.08em;
        }
        .nav-btn:hover, .nav-btn:focus {
          background: rgba(255,255,255,0.22);
          color: #ffe066;
          box-shadow: 0 4px 16px rgba(56,189,248,0.13);
          transform: translateY(-1px) scale(1.03);
          text-decoration: none;
        }
        .logout-group {
          display: flex;
          align-items: center;
          margin-left: 10px;
        }
        .logout-button {
          background: linear-gradient(90deg, #f87171 0%, #dc2626 100%);
          border: none;
          color: white;
          cursor: pointer;
          font-size: 0.90rem;
          font-weight: 600;
          border-radius: 16px;
          padding: 7px 16px;
          margin-left: 0;
          transition: background 0.2s, color 0.2s, box-shadow 0.18s;
          box-shadow: 0 2px 8px rgba(220,38,38,0.09);
        }
        .logout-button:hover {
          background: linear-gradient(90deg, #dc2626 0%, #f87171 100%);
          color: #ffe066;
          box-shadow: 0 4px 16px rgba(220,38,38,0.13);
        }
        .profile-btn {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 0.93rem;
          color: #2563eb;
          background: rgba(255,255,255,0.85);
          border-radius: 16px;
          font-weight: 600;
          padding: 6px 13px 6px 7px;
          margin-left: 6px;
          margin-right: 2px;
          box-shadow: 0 1px 8px #2563eb1a;
          border: 1.2px solid #e0e7ff;
          text-decoration: none;
          transition: background 0.18s, color 0.18s, box-shadow 0.18s, border 0.18s;
        }
        .profile-btn:hover, .profile-btn:focus {
          background: #e0e7ff;
          color: #1d4ed8;
          border: 1.2px solid #2563eb;
          box-shadow: 0 4px 14px #2563eb22;
          text-decoration: none;
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
          box-shadow: 0 2px 8px #2563eb22;
          border: 1.5px solid #fff;
          transition: border 0.18s;
        }
        .profile-name {
          font-weight: 600;
          letter-spacing: 0.01em;
          color: inherit;
        }
        main {
          min-height: 80vh;
          background: linear-gradient(120deg, #f4f7fb 0%, #e0e7ff 100%);
          padding: 28px 8px 20px;
          font-family: 'Inter', 'Segoe UI', Arial, sans-serif;
        }
        footer {
          text-align: center;
          padding: 10px 0;
          background: linear-gradient(90deg, #2563eb 0%, #38bdf8 100%);
          color: white;
          font-family: 'Inter', 'Segoe UI', Arial, sans-serif;
          font-size: 0.90rem;
          letter-spacing: 0.1px;
          box-shadow: 0 -2px 14px #38bdf822;
        }
        @media (max-width: 900px) {
          .nav-container {
            flex-direction: column;
            gap: 6px;
            padding: 0 3vw;
          }
          .nav-links-group {
            gap: 3px;
          }
          .logout-group {
            margin-left: 0;
            margin-top: 6px;
          }
        }
        @media (max-width: 600px) {
          .nav-container h1 {
            font-size: 0.98rem;
          }
          .nav-btn, .logout-button, .profile-btn {
            font-size: 0.84rem;
            padding: 5px 8px;
            border-radius: 13px;
          }
          .profile-avatar {
            width: 18px;
            height: 18px;
            font-size: 0.78rem;
          }
        }
      `}</style>

      <header className="header">
        <div className="nav-container">
          <h1>
            <span role="img" aria-label="bus">🚌</span> Quick Bus
          </h1>
          <div style={{ display: "flex", alignItems: "center" }}>
            <div className="nav-links-group">
              <Link href="/home" legacyBehavior>
                <a className="nav-btn">Home</a>
              </Link>
             
              <Link href="/BookingList" legacyBehavior>
                <a className="nav-btn">My Bookings</a>
              </Link>
              <Link href="/availablebuses" legacyBehavior>
                <a className="nav-btn">Available Buses</a>
              </Link>
              <Link href="/about" legacyBehavior>
                <a className="nav-btn">About</a>
              </Link>
              <Link href="/contact" legacyBehavior>
                <a className="nav-btn">Contact Us</a>
              </Link>
              {profile ? (
                <Link href="/profile" legacyBehavior>
                  <a className="profile-btn">
                    <span className="profile-avatar">
                      {profile.name
                        ? profile.name.charAt(0).toUpperCase()
                        : (profile.email ? profile.email.charAt(0).toUpperCase() : '👤')}
                    </span>
                    <span className="profile-name">
                      {profile.name ? profile.name.split(' ')[0] : profile.email}
                    </span>
                  </a>
                </Link>
              ) : null}
            </div>
            <div className="logout-group">
              {profile ? (
                <button className="logout-button" onClick={handleLogout}>Log out</button>
              ) : (
                <Link href="/" legacyBehavior>
                  <a className="nav-btn">Login</a>
                </Link>
              )}
            </div>
          </div>
        </div>
      </header>

      <main>{children}</main>

      <footer>
        <p>&copy; {new Date().getFullYear()} Bus Booking. All rights reserved.</p>
      </footer>
    </>
  );
}
