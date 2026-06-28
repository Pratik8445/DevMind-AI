import axios from "axios";

const API = "http://localhost:5000/api";

// Register new user
export async function register(name, email, password) {
  const { data } = await axios.post(`${API}/auth/register`, { name, email, password });
  return data; // { token, user }
}

// Login existing user
export async function login(email, password) {
  const { data } = await axios.post(`${API}/auth/login`, { email, password });
  return data; // { token, user }
}

// Get logged-in user profile
export async function getMe(token) {
  const { data } = await axios.get(`${API}/auth/me`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return data;
}
