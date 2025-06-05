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

  // Styles
  const headerStyle = {
    backgroundColor: '#333',
    padding: '1rem 0',
    color: 'white',
  };

  const navContainer = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '0 20px',
  };

  const linkStyle = {
    marginLeft: '20px',
    textDecoration: 'none',
    color: 'white',
    fontSize: '1rem',
  };

  const profileStyle = {
    marginLeft: '20px',
    fontSize: '1rem',
    color: 'white',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
  };

  const mainStyle = {
    minHeight: '80vh',
    padding: '20px',
    backgroundColor: '#f9f9f9',
  };

  const footerStyle = {
    textAlign: 'center',
    padding: '10px 0',
    backgroundColor: '#333',
    color: 'white',
  };

  return (
    <>
      <header style={headerStyle}>
        <div style={navContainer}>
          <h1 style={{ margin: 0, color: 'white' }}>Bus Booking App</h1>
          <nav style={{ display: 'flex', alignItems: 'center' }}>
            <Link href="/home" style={linkStyle}>Home</Link>
            <Link href="/BookingForm" style={linkStyle}>Book Ticket</Link>
            <Link href="/BookingList" style={linkStyle}>My Bookings</Link>
            <Link href="/about" style={linkStyle}>About</Link>
            <Link href="/contact" style={linkStyle}>Contact</Link>

            {profile ? (
              <>
                <Link href="/profile" style={profileStyle}>
                  👤 {profile.name ? profile.name.split(' ')[0] : profile.email}
                </Link>
                <button
                  onClick={handleLogout}
                  style={{
                    ...linkStyle,
                    cursor: 'pointer',
                    background: 'transparent',
                    border: 'none',
                    padding: 0,
                    fontSize: '1rem',
                    color: 'white',
                  }}
                  type="button"
                >
                  Log out
                </button>
              </>
            ) : (
              <Link href="/" style={linkStyle}>Login</Link>
            )}
          </nav>
        </div>
      </header>

      <main style={mainStyle}>{children}</main>

      <footer style={footerStyle}>
        <p>&copy; {new Date().getFullYear()} Bus Booking. All rights reserved.</p>
      </footer>
    </>
  );
}
