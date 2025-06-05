// app/contact/page.jsx or pages/contact.jsx
'use client';

import React from 'react';
import RequireAuth from '@/components/RequireAuth';
import Layout from '@/components/layout';

export default function ContactPage() {
  return (
    <RequireAuth>
      <Layout>
        <div style={{ maxWidth: 800, margin: '40px auto', padding: 20 }}>
          <h1>Contact Us</h1>
          <p>
            Need help or want to get in touch? Reach out to us at:
          </p>
          <ul>
            <li>Email: support@example.com</li>
            <li>Phone: +1 234 567 8900</li>
            <li>Address: 123 Main Street, City, Country</li>
          </ul>
        </div>
      </Layout>
    </RequireAuth>
  );
}
