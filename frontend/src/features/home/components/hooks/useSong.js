import { useCallback, useState } from 'react';
import { getSong } from '../../../song/services/songs.api';
import { useSongContext } from '../../../song/services/song.hook';

export function useSong() {
  const { song, setSong, updateSong, clearSong, loading, setLoading } = useSongContext();
  const [error, setError] = useState(null);

  const handleGetSong = useCallback(async ({ mood } = {}) => {
    if (typeof mood !== 'string' || !mood.trim()) {
      const inputError = new TypeError('A mood is required to find a song.');
      setError(inputError.message);
      return null;
    }

    setLoading(true);
    setError(null);

    try {
      const data = await getSong({ mood });
      const nextSong = data?.song;

      if (!nextSong || typeof nextSong !== 'object' || !nextSong.url) {
        setSong({});
        return null;
      }

      setSong(nextSong);
      return nextSong;
    } catch (error) {
      console.error('Failed to fetch song:', error);
      setError(error.response?.data?.message || error.message || 'Unable to fetch a song.');
      return null;
    } finally {
      setLoading(false);
    }
  }, [setLoading, setSong]);

  return {
    song,
    setSong,
    updateSong,
    clearSong,
    loading,
    error,
    setLoading,
    handleGetSong,
  };
}

export default useSong;
