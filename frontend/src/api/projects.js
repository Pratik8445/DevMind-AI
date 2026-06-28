import axios from "axios";

const API = "http://localhost:5000/api";

// Generate a new blueprint
export async function generateProject(idea, token) {
  const { data } = await axios.post(
    `${API}/project/generate`,
    { idea },
    { headers: { Authorization: `Bearer ${token}` } }
  );
  return data;
}

// Get project history list
export async function getHistory(token) {
  const { data } = await axios.get(`${API}/project/history`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return data;
}

// Get a single project by ID
export async function getProject(id, token) {
  const { data } = await axios.get(`${API}/project/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return data;
}
