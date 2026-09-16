import { useState } from 'react';
import { SongContext } from './song.context';

export function SongProvider({ children }) {
  const [song, setSong] = useState({
    _id: '',
    title: '',
    url: '',
    posterurl: '',
    mood: '',
    artist: '',
    duration: '',
  });
  const [loading, setLoading] = useState(false);

  const updateSong = (nextSong) => {
    setSong((prevSong) => ({
      ...prevSong,
      ...nextSong,
    }));
  };

  const clearSong = () => {
    setSong({
      _id: '',
      title: '',
      url: '',
      posterurl: '',
      mood: '',
      artist: '',
      duration: '',
    });
  };

  return (
    <SongContext.Provider value={{ song, setSong, updateSong, clearSong, loading, setLoading }}>
      {children}
    </SongContext.Provider>
  );
}

