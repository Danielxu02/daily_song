import React, { useState, useEffect } from 'react';
import { searchTracks, formatTrackData } from '../services/spotifyService';
import './SongSearch.css';

const SongSearch = ({ onSongSelect }) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  
  // Search for songs when query changes
  useEffect(() => {
    const timer = setTimeout(async () => {
      if (query.trim()) {
        setIsLoading(true);
        try {
          const tracks = await searchTracks(query);
          setResults(tracks);
        } catch (error) {
          console.error('Error searching songs:', error);
        } finally {
          setIsLoading(false);
        }
      } else {
        setResults([]);
      }
    }, 500); // Debounce searches by 500ms
    
    return () => clearTimeout(timer);
  }, [query]);
  
  const handleSongSelect = (song) => {
    onSongSelect(formatTrackData(song));
  };
  
  return (
    <div className="song-search">
      <div className="search-bar">
        <input
          type="text"
          placeholder="Search for a song..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </div>
      
      {isLoading && <div className="loading">Searching...</div>}
      
      <div className="search-results">
        {results.map(song => (
          <div key={song.id} className="song-result" onClick={() => handleSongSelect(song)}>
            <img 
              src={song.album.images[1]?.url || 'placeholder.png'} 
              alt={`${song.album.name} cover`}
              className="album-thumbnail"
            />
            <div className="song-info">
              <div className="song-title">{song.name}</div>
              <div className="song-artist">{song.artists.map(artist => artist.name).join(', ')}</div>
            </div>
          </div>
        ))}
        
        {results.length === 0 && query && !isLoading && (
          <div className="no-results">No songs found. Try another search.</div>
        )}
      </div>
    </div>
  );
};

export default SongSearch;