'use client';

import React from 'react';
import RequireAuth from '@/components/RequireAuth';
import Layout from '@/components/layout';

export default function AboutPage() {
  return (
    <RequireAuth>
      <Layout>
        <div className="about-bg">
          <div className="about-container">
            <h1>About Us</h1>
            <p>
              Welcome to our app! We are committed to providing the best service possible.
              Below is a quick snapshot of who we are and what we do.
            </p>

            <table className="about-table">
              <thead>
                <tr>
                  <th>Founded</th>
                  <th>Users</th>
                  <th>Support</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>2023</td>
                  <td>10,000+</td>
                  <td>24/7 Live Chat</td>
                </tr>
              </tbody>
            </table>

            <p>
              Our mission is to make your experience seamless and enjoyable. We continuously
              innovate and improve based on your feedback.
            </p>
          </div>
        </div>
        <style jsx>{`
          .about-bg {
            min-height: 100vh;
            background: linear-gradient(120deg, #e0e7ff 0%, #f0fdfa 100%);
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 40px 0;
          }
          .about-container {
            max-width: 520px;
            margin: 0 auto;
            padding: 38px 32px 30px;
            border-radius: 18px;
            background: rgba(255, 255, 255, 0.95);
            box-shadow: 0 8px 32px 0 rgba(37,99,235,0.10);
            backdrop-filter: blur(3px);
            font-family: 'Inter', 'Segoe UI', Arial, sans-serif;
            color: #334155;
          }
          .about-container h1 {
            text-align: center;
            color: #2563eb;
            font-size: 2rem;
            font-weight: 700;
            margin-bottom: 22px;
            letter-spacing: 0.5px;
          }
          .about-container p {
            font-size: 1.08rem;
            line-height: 1.7;
            margin-bottom: 18px;
            color: #475569;
            text-align: center;
          }
          .about-table {
            width: 100%;
            border-collapse: separate;
            border-spacing: 0;
            margin: 28px 0 22px;
            border-radius: 12px;
            overflow: hidden;
            box-shadow: 0 2px 8px rgba(37,99,235,0.09);
            background: #fff;
          }
          .about-table th {
            background: linear-gradient(90deg, #38bdf8 0%, #2563eb 100%);
            color: #fff;
            font-size: 1.07rem;
            font-weight: 600;
            padding: 14px 10px;
            border: none;
            letter-spacing: 0.3px;
          }
          .about-table td {
            padding: 13px 10px;
            border-top: 1px solid #f1f5f9;
            font-size: 1rem;
            color: #334155;
            background: #f9fafb;
            text-align: center;
          }
          .about-table tr:nth-child(even) td {
            background: #f1f5f9;
          }
          @media (max-width: 600px) {
            .about-container {
              padding: 18px 6vw 16px;
            }
          }
        `}</style>
      </Layout>
    </RequireAuth>
  );
}
