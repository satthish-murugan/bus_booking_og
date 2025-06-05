import React, { useState, useEffect } from 'react';
import Register from '../components/register';
import Login from '../components/login';
import { useRouter } from 'next/router';
import Cookies from 'js-cookie';

export default function IndexPage() {
  const [authView, setAuthView] = useState('login');
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const token = Cookies.get('token');
    console.log('Token on load:', token);

    if (token) {
      router.push('/home'); // Important: replace avoids back to login
    } else {
      setLoading(false);
    }
  }, [router]);

  const handleAuthSuccess = () => {
    router.replace('/home');
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="home-container">
      <style jsx>{`
        .home-container {
          max-width: 450px;
          margin: 60px auto;
          background: white;
          padding: 30px;
          border-radius: 10px;
          box-shadow: 0 5px 20px rgba(0, 0, 0, 0.1);
          font-family: 'Segoe UI', sans-serif;
        }
        .welcome-heading {
          text-align: center;
          margin-bottom: 10px;
          color: #007bff;
        }
        .switch-auth {
          text-align: center;
          margin-top: 15px;
        }
        .switch-auth span {
          color: #007bff;
          cursor: pointer;
          font-weight: bold;
        }
      `}</style>

      <h1 className="welcome-heading">Welcome to Bus Booking</h1>

      {authView === 'login' ? (
        <Login onSuccess={handleAuthSuccess} />
      ) : (
        <Register onSuccess={handleAuthSuccess} />
      )}

      <div className="switch-auth">
        {authView === 'signup' ? (
          <p>
            Already have an account?{' '}
            <span onClick={() => setAuthView('login')}>Login</span>
          </p>
        ) : (
          <p>
            Don't have an account?{' '}
            <span onClick={() => setAuthView('signup')}>Sign Up</span>
          </p>
        )}
      </div>
    </div>
  );
}
