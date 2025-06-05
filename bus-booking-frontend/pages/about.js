// app/about/page.jsx or pages/about.jsx
'use client';

import React from 'react';
import RequireAuth from '@/components/RequireAuth';
import Layout from '@/components/layout';

export default function AboutPage() {
  return (
    <RequireAuth>
      <Layout>
        <div style={{ maxWidth: 800, margin: '40px auto', padding: 20 }}>
          <h1>About Us</h1>
          <p>
            Welcome to our app! We are committed to providing the best
            service possible. This is the About page where you can learn more
            about us.
          </p>
        </div>
      </Layout>
    </RequireAuth>
  );
}
