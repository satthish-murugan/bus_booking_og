'use client';

import React, { useEffect, useState } from 'react';
import api from '../utils/api';
import Layout from '@/components/layout';
import RequireAuth from '@/components/RequireAuth';

export default function BookingList({ refresh }) {
  const [bookings, setBookings] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({
    passengername: '',
    busnumber: '',
    seatnumber: '',
  });

  const fetchBookings = async () => {
    try {
      const res = await api.get('/bookings'); // No Authorization header, cookies used
      setBookings(res.data);
    } catch (err) {
      console.error('Error fetching bookings:', err.response?.data || err.message);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure to delete this booking?')) return;
    try {
      await api.delete(`/deletePassenger/${id}`);
      fetchBookings();
    } catch (err) {
      console.error('Error deleting booking:', err.response?.data || err.message);
    }
  };

  const handleEditClick = (booking) => {
    setEditingId(booking._id);
    setEditForm({
      passengername: booking.passengername,
      busnumber: booking.busnumber,
      seatnumber: booking.seatnumber,
    });
  };

  const handleEditChange = (e) => {
    setEditForm({ ...editForm, [e.target.name]: e.target.value });
  };

  const handleEditSave = async (id) => {
    try {
      await api.put(`/updatePassenger/${id}`, editForm);
      setEditingId(null);
      fetchBookings();
    } catch (err) {
      console.error('Error updating booking:', err.response?.data || err.message);
    }
  };

  const handleEditCancel = () => {
    setEditingId(null);
  };

  useEffect(() => {
    fetchBookings();
  }, [refresh]);

  return (
    <RequireAuth>
      <Layout>
        <div style={styles.container}>
          <h2 style={styles.heading}>My Bookings</h2>
          {bookings.length === 0 ? (
            <p style={styles.noData}>No bookings found</p>
          ) : (
            <div style={styles.tableContainer}>
              <table style={styles.table}>
                <thead>
                  <tr style={styles.headerRow}>
                    <th>Passenger Name</th>
                    <th>Bus Number</th>
                    <th>Seat Number</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {bookings.map((b) => (
                    <tr key={b._id} style={styles.row}>
                      {editingId === b._id ? (
                        <>
                          <td>
                            <input
                              type="text"
                              name="passengername"
                              value={editForm.passengername}
                              onChange={handleEditChange}
                              style={styles.input}
                            />
                          </td>
                          <td>
                            <input
                              type="text"
                              name="busnumber"
                              value={editForm.busnumber}
                              onChange={handleEditChange}
                              style={styles.input}
                            />
                          </td>
                          <td>
                            <input
                              type="text"
                              name="seatnumber"
                              value={editForm.seatnumber}
                              onChange={handleEditChange}
                              style={styles.input}
                            />
                          </td>
                          <td>
                            <button onClick={() => handleEditSave(b._id)} style={styles.saveBtn}>
                              Save
                            </button>
                            <button onClick={handleEditCancel} style={styles.cancelBtn}>
                              Cancel
                            </button>
                          </td>
                        </>
                      ) : (
                        <>
                          <td>{b.passengername}</td>
                          <td>{b.busnumber}</td>
                          <td>{b.seatnumber}</td>
                          <td>
                            <button onClick={() => handleEditClick(b)} style={styles.editBtn}>
                              Edit
                            </button>
                            <button onClick={() => handleDelete(b._id)} style={styles.deleteBtn}>
                              Delete
                            </button>
                          </td>
                        </>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </Layout>
    </RequireAuth>
  );
}

const styles = {
  container: {
    padding: '20px',
    maxWidth: '1000px',
    margin: '0 auto',
    fontFamily: 'Arial, sans-serif',
  },
  heading: {
    textAlign: 'center',
    marginBottom: '20px',
    color: '#333',
  },
  noData: {
    textAlign: 'center',
    color: '#999',
  },
  tableContainer: {
    overflowX: 'auto',
    borderRadius: '10px',
    boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    backgroundColor: '#fff',
  },
  headerRow: {
    backgroundColor: '#007bff',
    color: '#fff',
  },
  row: {
    borderBottom: '1px solid #ddd',
  },
  input: {
    width: '100%',
    padding: '6px',
    border: '1px solid #ccc',
    borderRadius: '4px',
  },
  editBtn: {
    marginRight: '10px',
    padding: '6px 12px',
    backgroundColor: '#17a2b8',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
  },
  deleteBtn: {
    padding: '6px 12px',
    backgroundColor: '#dc3545',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
  },
  saveBtn: {
    marginRight: '10px',
    padding: '6px 12px',
    backgroundColor: '#28a745',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
  },
  cancelBtn: {
    padding: '6px 12px',
    backgroundColor: '#6c757d',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
  },
};
