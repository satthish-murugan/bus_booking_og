'use client';

import React from 'react';
import RequireAuth from '@/components/RequireAuth';
import Layout from '@/components/layout';

export default function ContactPage() {
  return (
    <RequireAuth>
      <Layout>
        <div className="contact-bg">
          <div className="contact-container">
            <h1>Contact Us</h1>
            <p>Need help or want to get in touch? Reach out to us at:</p>
            <ul>
              <li>
                <span className="icon">📧</span>
                <span>
                  <strong>Email:</strong> support@example.com
                </span>
              </li>
              <li>
                <span className="icon">📞</span>
                <span>
                  <strong>Phone:</strong> +1 234 567 8900
                </span>
              </li>
              <li>
                <span className="icon">📍</span>
                <span>
                  <strong>Address:</strong> 123 Main Street, City, Country
                </span>
              </li>
            </ul>
          </div>
        </div>
        <style jsx>{`
          .contact-bg {
            min-height: 100vh;
            background: linear-gradient(120deg, #e0e7ff 0%, #f0fdfa 100%);
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 40px 0;
          }
          .contact-container {
            max-width: 480px;
            margin: 0 auto;
            padding: 38px 32px 30px;
            border-radius: 18px;
            background: rgba(255, 255, 255, 0.92);
            box-shadow: 0 8px 32px 0 rgba(37,99,235,0.10);
            backdrop-filter: blur(3px);
            font-family: 'Inter', 'Segoe UI', Arial, sans-serif;
            color: #334155;
          }
          .contact-container h1 {
            text-align: center;
            color: #2563eb;
            font-size: 2rem;
            font-weight: 700;
            margin-bottom: 22px;
            letter-spacing: 0.5px;
          }
          .contact-container p {
            font-size: 1.08rem;
            margin-bottom: 24px;
            text-align: center;
            color: #475569;
          }
          .contact-container ul {
            list-style-type: none;
            padding: 0;
            font-size: 1.06rem;
            margin: 0;
          }
          .contact-container li {
            display: flex;
            align-items: center;
            gap: 14px;
            margin-bottom: 18px;
            padding: 15px 16px;
            background: #f8fafc;
            border-left: 5px solid #2563eb;
            border-radius: 10px;
            box-shadow: 0 1px 6px rgba(37,99,235,0.04);
            font-size: 1.03rem;
          }
          .icon {
            font-size: 1.5rem;
            color: #2563eb;
          }
          @media (max-width: 600px) {
            .contact-container {
              padding: 18px 6vw 16px;
            }
          }
        `}</style>
      </Layout>
    </RequireAuth>
  );
}
