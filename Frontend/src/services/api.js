import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:5050/api',
});

// Interceptor to attach the JWT token to every request automatically
API.interceptors.request.use((req) => {
  const token = localStorage.getItem('token');
  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  }
  return req;
});

// --- NEW: Helper function to fetch User Profile ---
// Assuming your user routes in server.js are mounted at '/users' (e.g. app.use('/api/users', userRoutes))
export const fetchUserProfileAPI = async () => {
  try {
    const response = await API.get('/users/profile'); // Adjust "/users/profile" if your server.js route prefix is different
    return response.data;
  } catch (error) {
    console.error("Error fetching user profile:", error);
    throw error;
  }
};

export default API;