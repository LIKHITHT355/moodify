import { useContext } from 'react';
import { SongContext } from './song.context';

export function useSongContext() {
  const context = useContext(SongContext);

  if (!context) {
    throw new Error('useSongContext must be used inside a SongProvider');
  }

  return context;
}
