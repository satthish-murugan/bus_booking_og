'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function RequireAuth({ children }) {
  const router = useRouter();
  const [authChecked, setAuthChecked] = useState(false);
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await fetch('http://localhost:5000/api/userActions/profile', {
          method: 'GET',
          credentials: 'include',
        });

        if (res.ok) {
          setIsAuthorized(true);
        } else {
          router.replace('/'); // redirect to login page
        }
      } catch (err) {
        router.replace('/');
      } finally {
        setAuthChecked(true);
      }
    };

    checkAuth();
  }, [router]);

  if (!authChecked) {
    // show spinner or loading text
    return <div>Loading...</div>;
  }

  if (!isAuthorized) {
    return null; // or redirect handled by router.replace above
  }

  return children;
}
