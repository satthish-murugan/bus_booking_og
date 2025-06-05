import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000/api/userActions',
  withCredentials: true, // ✅ This includes cookies with every request
});

export default api;
