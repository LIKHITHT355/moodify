import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3000',
  withCredentials: true,
});

const VALID_MOODS = new Set(['sad', 'happy', 'surprised']);

function requireMood(mood) {
  if (typeof mood !== 'string' || !VALID_MOODS.has(mood.trim().toLowerCase())) {
    throw new TypeError('Mood must be sad, happy, or surprised.');
  }

  return mood.trim().toLowerCase();
}

export async function getSong({ mood } = {}) {
  const response = await api.get('/api/song', {
    params: { mood: requireMood(mood) },
  });
  return response.data;
}
