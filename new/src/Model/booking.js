const mongoose = require('mongoose');

const BookingSchema = new mongoose.Schema({
  passengername: { type: String, required: true },
  busnumber: { type: String, required: true },
  seatnumber: { type: String, required: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
});

module.exports = mongoose.model('Booking', BookingSchema);
