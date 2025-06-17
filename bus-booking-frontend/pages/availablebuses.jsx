'use client';

import React, { useEffect, useState } from 'react';
import Layout from '@/components/layout';
import RequireAuth from '@/components/RequireAuth';
import { useRouter } from 'next/router';

export default function AvailableBuses() {
  const [buses, setBuses] = useState([]);
  const [genderModal, setGenderModal] = useState({ show: false, seat: null });
  const [genderSeats, setGenderSeats] = useState({});
  const [selectedBus, setSelectedBus] = useState(null);
  const [bookedSeats, setBookedSeats] = useState([]);
  const [bookedSeatsGender, setBookedSeatsGender] = useState({});
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const router = useRouter();

  useEffect(() => {
    fetchBuses();
  }, []);

  useEffect(() => {
    if (selectedBus) {
      fetchBookedSeats(selectedBus._id);
    }
  }, [selectedBus]);

  const fetchBuses = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await fetch('http://localhost:5000/api/userActions/buses', {
        credentials: 'include',
      });

      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }

      const data = await res.json();

      if (!Array.isArray(data)) {
        throw new Error('Expected array but received: ' + JSON.stringify(data));
      }

      setBuses(data);
    } catch (err) {
      console.error('Error fetching buses:', err);
      setError(err.message);
      setBuses([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchBookedSeats = async (busId) => {
    try {
      const res = await fetch(`http://localhost:5000/api/userActions/buses/${busId}/bookedSeats`, {
        credentials: 'include',
      });

      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }

      const data = await res.json();
      const seats = Array.isArray(data.bookedSeats) ? data.bookedSeats.map(Number) : [];
      setBookedSeats(seats);
      
      const genders = {};
      if (Array.isArray(data.bookedSeatsWithGender)) {
        data.bookedSeatsWithGender.forEach(item => {
          genders[item.seatNumber] = item.gender;
        });
      }
      setBookedSeatsGender(genders);
    } catch (err) {
      console.error('Error fetching booked seats:', err);
      setBookedSeats([]);
      setBookedSeatsGender({});
    }
  };

  const handleSelectBus = (bus) => {
    setSelectedBus(bus);
    setSelectedSeats([]);
    setGenderSeats({});
  };

  const toggleSeat = (sn) => {
    if (bookedSeats.includes(sn)) return;

    if (genderSeats[sn]) {
      setSelectedSeats((prev) =>
        prev.includes(sn) ? prev.filter((s) => s !== sn) : [...prev, sn]
      );
      return;
    }

    const adjacentSeats = [sn - 1, sn + 1].filter(
      (n) => n > 0 && n <= (selectedBus?.totalSeats || 40)
    );
    const adjacentGenders = adjacentSeats.map((n) => genderSeats[n]).filter(Boolean);

    if (adjacentGenders.length > 0) {
      setGenderModal({ show: true, seat: sn });
      return;
    }

    setGenderModal({ show: true, seat: sn });
  };

  const handleGenderSelect = (gender) => {
    if (!genderModal.seat) return;

    setGenderSeats((prev) => ({
      ...prev,
      [genderModal.seat]: gender
    }));

    setSelectedSeats((prev) => [...prev, genderModal.seat]);
    setGenderModal({ show: false, seat: null });
  };

  const bookSeats = async () => {
    if (!selectedBus || selectedSeats.length === 0) return;
    try {
      const res = await fetch(
        `http://localhost:5000/api/userActions/buses/${selectedBus._id}/decrementSeat`,
        {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify({
            seats: selectedSeats,
            genders: selectedSeats.map((seat) => ({
              seatNumber: seat,
              gender: genderSeats[seat] || 'none'
            }))
          }),
        }
      );
      const data = await res.json();
      if (res.ok) {
        router.push(
          `/BookingForm?busNumber=${selectedBus.busNumber}&busId=${selectedBus._id}&seats=${selectedSeats.join(',')}`
        );
      } else {
        alert(data.message || 'Booking failed');
      }
    } catch (err) {
      console.error('Booking error:', err);
    }
  };

  const renderSeats = () => {
    if (!selectedBus) return null;

    const totalSeats = selectedBus.totalSeats || 40;
    const seatRows = [];
    const seatsPerRow = 4;
    const rowCount = Math.ceil(totalSeats / seatsPerRow);

    for (let row = 0; row < rowCount; row++) {
      const rowSeats = [];
      const startSeat = row * seatsPerRow + 1;
      const endSeat = Math.min((row + 1) * seatsPerRow, totalSeats);

      // Left side seats (2 seats)
      for (let i = startSeat; i <= startSeat + 1; i++) {
        if (i > endSeat) break;
        
        const isBooked = bookedSeats.includes(i);
        const isSelected = selectedSeats.includes(i);
        const gender = isBooked ? bookedSeatsGender[i] : genderSeats[i];

        rowSeats.push(
          <button
            key={i}
            onClick={() => toggleSeat(i)}
            disabled={isBooked}
            className={`seat 
              ${isBooked ? 'booked' : ''} 
              ${isSelected ? 'selected' : ''} 
              ${gender === 'male' ? 'male-seat' : ''} 
              ${gender === 'female' ? 'female-seat' : ''}`}
          >
            {i}
          </button>
        );
      }

      // Right side seats (2 seats)
      for (let i = startSeat + 2; i <= endSeat; i++) {
        const isBooked = bookedSeats.includes(i);
        const isSelected = selectedSeats.includes(i);
        const gender = isBooked ? bookedSeatsGender[i] : genderSeats[i];

        rowSeats.push(
          <button
            key={i}
            onClick={() => toggleSeat(i)}
            disabled={isBooked}
            className={`seat 
              ${isBooked ? 'booked' : ''} 
              ${isSelected ? 'selected' : ''} 
              ${gender === 'male' ? 'male-seat' : ''} 
              ${gender === 'female' ? 'female-seat' : ''}`}
          >
            {i}
          </button>
        );
      }

      seatRows.push(
        <div key={row} className="seat-row">
          <div className="left-seats">
            {rowSeats[0]}
            {rowSeats[1]}
          </div>
          <div className="right-seats">
            {rowSeats[2]}
            {rowSeats[3]}
          </div>
        </div>
      );
    }

    return <div className="seat-container">{seatRows}</div>;
  };

  return (
    <RequireAuth>
      <Layout>
        <div className="available-buses-container">
          <h1 className="page-title">Available Buses</h1>
          {loading ? (
            <div className="loading-spinner">Loading buses...</div>
          ) : error ? (
            <div className="error-message">
              Error loading buses: {error}
              <button onClick={fetchBuses} className="retry-button">
                Retry
              </button>
            </div>
          ) : !Array.isArray(buses) || buses.length === 0 ? (
            <div className="no-buses">No buses available at the moment.</div>
          ) : (
            <>
              <div className="buses-list">
                {buses.map((bus) => (
                  <div
                    key={bus._id}
                    onClick={() => handleSelectBus(bus)}
                    className={`bus-card ${selectedBus?._id === bus._id ? 'selected' : ''}`}
                  >
                    <div className="bus-header">
                      <h3>{bus.busName} ({bus.busNumber})</h3>
                    </div>
                    <div className="bus-details">
                      <div className="detail-item">
                        <span>Route: {bus.from} → {bus.to}</span>
                      </div>
                      <div className="detail-item">
                        <span>Time: {bus.departureTime} → {bus.arrivalTime}</span>
                      </div>
                      <div className="detail-item">
                        <span>Date: {bus.date?.split('T')[0]}</span>
                      </div>
                      <div className="detail-item">
                        <span>Seats: {bus.totalSeats - bookedSeats.length} available</span>
                      </div>
                      <div className="detail-item">
                        <span>Price: ₹{bus.pricePerSeat} per seat</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              {selectedBus && (
                <div className="seat-selection-container">
                  <h2 className="section-title">Select Your Seats</h2>
                  <div className="seat-selection">
                    {renderSeats()}
                    <div className="seat-legend">
                      <div className="legend-item">
                        <div className="legend-color available"></div>
                        <span>Available</span>
                      </div>
                      <div className="legend-item">
                        <div className="legend-color selected"></div>
                        <span>Selected</span>
                      </div>
                      <div className="legend-item">
                        <div className="legend-color male-booked"></div>
                        <span>Male (Booked)</span>
                      </div>
                      <div className="legend-item">
                        <div className="legend-color female-booked"></div>
                        <span>Female (Booked)</span>
                      </div>
                      <div className="legend-item">
                        <div className="legend-color male"></div>
                        <span>Male (Selected)</span>
                      </div>
                      <div className="legend-item">
                        <div className="legend-color female"></div>
                        <span>Female (Selected)</span>
                      </div>
                    </div>
                  </div>
                  <div className="booking-summary">
                    <div className="summary-item">
                      <span className="summary-label">Selected Seats:</span>
                      <span className="summary-value">
                        {selectedSeats.map(seat => (
                          <span key={seat} className={`seat-tag ${genderSeats[seat] || ''}`}>
                            {seat} ({genderSeats[seat] || 'not specified'})
                          </span>
                        ))}
                        {selectedSeats.length === 0 && 'None'}
                      </span>
                    </div>
                    <div className="summary-item">
                      <span className="summary-label">Total Price:</span>
                      <span className="summary-value price">₹{selectedSeats.length * selectedBus.pricePerSeat}</span>
                    </div>
                    <div className="action-buttons">
                      <button
                        onClick={bookSeats}
                        disabled={selectedSeats.length === 0}
                        className="book-button"
                      >
                        Book Now
                      </button>
                      <button
                        onClick={() => fetchBookedSeats(selectedBus._id)}
                        className="refresh-button"
                      >
                        Refresh Seats
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        {genderModal.show && (
          <div className="gender-modal">
            <div className="modal-content">
              <h3>Select Gender for Seat {genderModal.seat}</h3>
              <p>This helps us maintain comfortable seating arrangements</p>
              <div className="gender-options">
                <button
                  onClick={() => handleGenderSelect('male')}
                  className="male-option"
                >
                  Male
                </button>
                <button
                  onClick={() => handleGenderSelect('female')}
                  className="female-option"
                >
                  Female
                </button>
                <button
                  onClick={() => setGenderModal({ show: false, seat: null })}
                  className="cancel-option"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        <style jsx global>{`
          .available-buses-container {
            padding: 2rem;
            max-width: 1200px;
            margin: 0 auto;
          }

          .page-title {
            font-size: 2rem;
            font-weight: 600;
            color: #2d3748;
            margin-bottom: 2rem;
            text-align: center;
          }

          .loading-spinner {
            text-align: center;
            padding: 2rem;
            font-size: 1.2rem;
            color: #4a5568;
          }

          .error-message {
            text-align: center;
            padding: 2rem;
            font-size: 1.2rem;
            color: #e53e3e;
            background: #fff5f5;
            border-radius: 0.5rem;
            margin-bottom: 1rem;
          }

          .retry-button {
            margin-top: 1rem;
            padding: 0.5rem 1rem;
            background: #4299e1;
            color: #fff;
            border: none;
            border-radius: 0.5rem;
            cursor: pointer;
          }

          .no-buses {
            text-align: center;
            padding: 2rem;
            font-size: 1.2rem;
            color: #4a5568;
          }

          .buses-list {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
            gap: 1.5rem;
            margin-bottom: 2rem;
          }

          .bus-card {
            background: white;
            border-radius: 0.75rem;
            padding: 1.5rem;
            box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
            transition: all 0.2s ease;
            cursor: pointer;
            border: 2px solid #e2e8f0;
          }

          .bus-card:hover {
            transform: translateY(-2px);
            box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
            border-color: #4299e1;
          }

          .bus-card.selected {
            border-color: #4299e1;
            background-color: #ebf8ff;
          }

          .bus-header {
            margin-bottom: 1rem;
            padding-bottom: 0.5rem;
            border-bottom: 1px solid #e2e8f0;
          }

          .bus-header h3 {
            font-size: 1.25rem;
            font-weight: 600;
            color: #2d3748;
            margin: 0;
          }

          .bus-details {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
            gap: 1rem;
          }

          .detail-item {
            color: #4a5568;
            font-size: 0.95rem;
          }

          .seat-selection-container {
            margin-top: 3rem;
            background: white;
            border-radius: 0.75rem;
            padding: 2rem;
            box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
          }

          .section-title {
            font-size: 1.5rem;
            font-weight: 600;
            color: #2d3748;
            margin-bottom: 1.5rem;
            text-align: center;
          }

          .seat-container {
            display: flex;
            flex-direction: column;
            gap: 0.5rem;
            margin-bottom: 1.5rem;
            max-width: 300px;
            margin: 0 auto;
          }

          .seat-row {
            display: flex;
            justify-content: space-between;
            align-items: center;
            gap: 0.25rem;
          }

          .left-seats, .right-seats {
            display: flex;
            gap: 0.25rem;
          }

          .seat {
            position: relative;
            width: 50px;
            height: 50px;
            border-radius: 8px;
            display: flex;
            align-items: center;
            justify-content: center;
            background: #edf2f7;
            border: 2px solid #e2e8f0;
            cursor: pointer;
            transition: all 0.2s ease;
            font-weight: 600;
            font-size: 1rem;
            color: #2d3748;
          }

          .seat:hover:not(.booked) {
            background: #bee3f8;
            border-color: #90cdf4;
          }

          .seat.selected:not(.male-seat):not(.female-seat) {
            background: #2b6cb0 !important;
            border-color: #2c5282 !important;
            color: white !important;
          }

          .seat.male-seat,
          .seat.male-seat.selected {
            background: #4299e1 !important;
            border-color: #3182ce !important;
            color: white !important;
          }

          .seat.female-seat,
          .seat.female-seat.selected {
            background: #ed64a6 !important;
            border-color: #d53f8c !important;
            color: white !important;
          }

          .seat.booked.male-seat {
            background: #63b3ed !important;
            border-color: #4299e1 !important;
            color: white !important;
          }

          .seat.booked.female-seat {
            background: #f687b3 !important;
            border-color: #ed64a6 !important;
            color: white !important;
          }

          .seat.booked:not(.male-seat):not(.female-seat) {
            background: #e2e8f0 !important;
            color: #a0aec0 !important;
            cursor: not-allowed;
          }

          .seat-legend {
            display: flex;
            flex-wrap: wrap;
            gap: 0.75rem;
            margin-top: 1.5rem;
            justify-content: center;
          }

          .legend-item {
            display: flex;
            align-items: center;
            gap: 0.5rem;
            font-size: 0.85rem;
          }

          .legend-color {
            width: 16px;
            height: 16px;
            border-radius: 4px;
            border: 1px solid #cbd5e0;
          }

          .legend-color.available {
            background: #edf2f7;
          }
          .legend-color.selected {
            background: #2b6cb0;
          }
          .legend-color.male-booked {
            background: #63b3ed;
          }
          .legend-color.female-booked {
            background: #f687b3;
          }
          .legend-color.male {
            background: #4299e1;
          }
          .legend-color.female {
            background: #ed64a6;
          }

          .booking-summary {
            margin-top: 2rem;
            background: #f7fafc;
            border-radius: 0.5rem;
            padding: 1.5rem;
            box-shadow: 0 2px 4px -1px rgba(0,0,0,0.05);
          }

          .summary-item {
            display: flex;
            gap: 1rem;
            align-items: flex-start;
            margin-bottom: 1rem;
          }

          .summary-label {
            font-weight: 500;
            color: #2d3748;
            min-width: 120px;
          }

          .summary-value {
            font-weight: 600;
            color: #2b6cb0;
            display: flex;
            flex-wrap: wrap;
            gap: 0.5rem;
          }

          .summary-value.price {
            color: #d53f8c;
            font-size: 1.2rem;
          }

          .seat-tag {
            display: inline-block;
            padding: 0.2rem 0.6rem;
            border-radius: 999px;
            background: #e2e8f0;
            color: #2d3748;
            font-size: 0.85em;
          }
          .seat-tag.male {
            background: #4299e1;
            color: #fff;
          }
          .seat-tag.female {
            background: #ed64a6;
            color: #fff;
          }

          .action-buttons {
            display: flex;
            gap: 1rem;
            margin-top: 1.5rem;
            justify-content: center;
          }

          .book-button {
            background: #38a169;
            color: #fff;
            border: none;
            border-radius: 0.5rem;
            padding: 0.7rem 1.5rem;
            font-size: 1rem;
            font-weight: 600;
            cursor: pointer;
            transition: background 0.2s;
          }

          .book-button:hover:not(:disabled) {
            background: #2f855a;
          }

          .book-button:disabled {
            background: #a0aec0;
            cursor: not-allowed;
          }

          .refresh-button {
            background: #4299e1;
            color: #fff;
            border: none;
            border-radius: 0.5rem;
            padding: 0.7rem 1.5rem;
            font-size: 1rem;
            font-weight: 600;
            cursor: pointer;
            transition: background 0.2s;
          }

          .refresh-button:hover {
            background: #3182ce;
          }

          .gender-modal {
            position: fixed;
            top: 0;
            left: 0;
            width: 100vw;
            height: 100vh;
            background: rgba(0,0,0,0.4);
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 1000;
          }

          .modal-content {
            background: #fff;
            padding: 2rem;
            border-radius: 0.75rem;
            box-shadow: 0 6px 24px rgba(0,0,0,0.15);
            min-width: 300px;
            max-width: 90%;
            text-align: center;
          }

          .modal-content h3 {
            margin-top: 0;
            color: #2d3748;
          }

          .modal-content p {
            color: #4a5568;
            margin-bottom: 1.5rem;
          }

          .gender-options {
            display: flex;
            gap: 1rem;
            margin-top: 1.5rem;
            justify-content: center;
          }

          .male-option,
          .female-option,
          .cancel-option {
            padding: 0.6rem 1.2rem;
            border: none;
            border-radius: 0.5rem;
            font-size: 1rem;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.2s;
          }

          .male-option {
            background: #4299e1;
            color: #fff;
          }
          .male-option:hover {
            background: #3182ce;
          }
          .female-option {
            background: #ed64a6;
            color: #fff;
          }
          .female-option:hover {
            background: #d53f8c;
          }
          .cancel-option {
            background: #a0aec0;
            color: #fff;
          }
          .cancel-option:hover {
            background: #718096;
          }
        `}</style>
      </Layout>
    </RequireAuth>
  );
}