import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const getNotes = async (roomId) => {
  try {
    const response = await api.get(`/api/notes/${roomId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching notes:', error);
    throw error;
  }
};

export const createNote = async (roomId, content) => {
  try {
    const response = await api.post(`/api/notes`, { roomId, content });
    return response.data;
  } catch (error) {
    console.error('Error creating note:', error);
    throw error;
  }
};

// Change this function in your api.js file
export const updateNote = async (roomId, content) => {
  try {
    // Change this line to use the room endpoint
    const response = await api.put(`/api/notes/room/${roomId}`, { content });
    return response.data;
  } catch (error) {
    console.error('Error updating note:', error);
    throw error;
  }
};

export default api;